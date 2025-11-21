const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

// Helper function to compare dates (ignoring time)
function isSameDate(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
}

// Create appointment WITHOUT double booking 
module.exports.createAppointment = async (req, res) => {
    try {
        const { date, startTime, endTime, patientId, doctorId } = req.body;

        // Make sure all fields are filled
        if (!date || !startTime || !endTime || !patientId || !doctorId) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }

        // Parse the appointment date
        const appointmentDate = new Date(date);
        // Normalize to midnight
        appointmentDate.setHours(0, 0, 0, 0); 

        // Convert times to comparable format with actual date
        const appointmentStart = new Date(appointmentDate);
        const [startHour, startMin] = startTime.split(':');
        appointmentStart.setHours(parseInt(startHour), parseInt(startMin));

        const appointmentEnd = new Date(appointmentDate);
        const [endHour, endMin] = endTime.split(':');
        appointmentEnd.setHours(parseInt(endHour), parseInt(endMin));

        if (appointmentStart >= appointmentEnd) {
            return res.status(400).json({ error: "Start time must be before end time" });
        }
        
        // Check for double booking
        const existingApts = await Appointment.find({});

        for (const existing of existingApts) {
            // Only check appointments on the same date
            if (!isSameDate(existing.date, appointmentDate)) {
                continue;
            }

            const existingDate = new Date(existing.date);
            existingDate.setHours(0, 0, 0, 0);

            const existingStart = new Date(existingDate);
            const [existingStartHour, existingStartMin] = existing.startTime.split(':');
            existingStart.setHours(parseInt(existingStartHour), parseInt(existingStartMin));

            const existingEnd = new Date(existingDate);
            const [existingEndHour, existingEndMin] = existing.endTime.split(':');
            existingEnd.setHours(parseInt(existingEndHour), parseInt(existingEndMin));
            
            /**
             * Translating this part to english cuz my brain hurts
             * if the new appointment starts BEFORE an existing one ends
             * AND
             * if the new appointment ends AFTER an existing one starts
             * THEN
             * there is overlap
             * 
             * or if its easier to think about it backwards
             * if the new appointment ends BEFORE an existing one starts
             * AND 
             * the new appointment starts AFTER an existing one ends
             * THEN
             * there is no overlap
             */
            const overlap = appointmentStart < existingEnd && appointmentEnd > existingStart;
            
            if (overlap) {
                if (existing.doctorId === doctorId) {
                    return res.status(409).json({ error: "Doctor is already booked during this time" });
                }
                if (existing.patientId === patientId) {
                    return res.status(409).json({ error: "Patient is already booked during this time" });
                }
            }
        }

        // Generate new Id
        const last = await Appointment.findOne().sort({ id: -1 });
        const newId = last ? last.id + 1 : 1;

        const newAppointment = new Appointment({
            id: newId,
            date,
            startTime,
            endTime,
            patientId,
            doctorId
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverside error" });
    }
};

// Get appointments
module.exports.getAppointments = async (req, res) => {
    try {
        const userId = parseInt(req.params.user);
        const role = req.user.role;
        let appointments;

        if (role === "patient") {
            appointments = await Appointment.find({ patientId: userId });
        } 
        else if (role === "doctor") {
            appointments = await Appointment.find({ doctorId: userId });
        }
        else if (role === "admin") {
            appointments = await Appointment.find();
        }
        else {
            return res.status(403).json({ error: "Unauthorized role, how did you even get here????" });
        }

        // Get more details for all appointments
        const betterApts = await Promise.all(
            appointments.map(async (apt) => {
                const doctor = await User.findOne({ id: apt.doctorId });
                const patient = await User.findOne({ id: apt.patientId });

                return {
                    ...apt.toObject(),
                    doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor",
                    patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"
                };
            })
        );

        return res.status(200).json(betterApts);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: "An error has occurred when trying to fetch appointments, check console" });
    }
};

// Update appointment WITH double booking check
module.exports.updateAppointment = async (req, res) => {
    try {
        const { date, startTime, endTime, patientId, doctorId } = req.body;
        const appointmentId = parseInt(req.params.id);

        const currentApt = await Appointment.findOne({ id: appointmentId });
        if (!currentApt) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        const updatedDate = date || currentApt.date;
        const updatedStartTime = startTime || currentApt.startTime;
        const updatedEndTime = endTime || currentApt.endTime;
        const updatedPatientId = patientId !== undefined ? patientId : currentApt.patientId;
        const updatedDoctorId = doctorId !== undefined ? doctorId : currentApt.doctorId;

        // Check if anything actually changed
        const dateChanged = !isSameDate(updatedDate, currentApt.date);
        const timeChanged = updatedStartTime !== currentApt.startTime || updatedEndTime !== currentApt.endTime;
        const usersChanged = updatedPatientId !== currentApt.patientId || updatedDoctorId !== currentApt.doctorId;

        // Only check for double booking if something relevant changed
        if (dateChanged || timeChanged || usersChanged) {
            const appointmentDate = new Date(updatedDate);
            appointmentDate.setHours(0, 0, 0, 0);

            const appointmentStart = new Date(appointmentDate);
            const [startHour, startMin] = updatedStartTime.split(':');
            appointmentStart.setHours(parseInt(startHour), parseInt(startMin));

            const appointmentEnd = new Date(appointmentDate);
            const [endHour, endMin] = updatedEndTime.split(':');
            appointmentEnd.setHours(parseInt(endHour), parseInt(endMin));

            // validate start < end
            if (appointmentStart >= appointmentEnd) {
                return res.status(400).json({ error: "Start time must be before end time" });
            }

            const existingApts = await Appointment.find({});

            for (const existing of existingApts) {
                // Exclude the appointment being updated
                if (existing.id === appointmentId) {
                    continue;
                }

                // Only check appointments on the same date
                if (!isSameDate(existing.date, appointmentDate)) {
                    continue;
                }

                const existingDate = new Date(existing.date);
                existingDate.setHours(0, 0, 0, 0);

                const existingStart = new Date(existingDate);
                const [existingStartHour, existingStartMin] = existing.startTime.split(':');
                existingStart.setHours(parseInt(existingStartHour), parseInt(existingStartMin));

                const existingEnd = new Date(existingDate);
                const [existingEndHour, existingEndMin] = existing.endTime.split(':');
                existingEnd.setHours(parseInt(existingEndHour), parseInt(existingEndMin));

                const overlap = appointmentStart < existingEnd && appointmentEnd > existingStart;
                
                if (overlap) {
                    if (existing.doctorId === updatedDoctorId) {
                        return res.status(409).json({ error: "Doctor is already booked during this time" });
                    }
                    if (existing.patientId === updatedPatientId) {
                        return res.status(409).json({ error: "Patient is already booked during this time" });
                    }
                }
            }
        }

        const updates = {
            date: updatedDate,
            startTime: updatedStartTime,
            endTime: updatedEndTime,
            patientId: updatedPatientId,
            doctorId: updatedDoctorId,
            lastUpdated: new Date()
        };

        const updatedAppointment = await Appointment.findOneAndUpdate(
            { id: appointmentId },
            updates,
            { new: true }
        );

        res.status(200).json({ message: "Appointment updated", appointment: updatedAppointment });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update appointment" });
    }
};

// Delete appointment
module.exports.deleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.findOneAndDelete({ id: req.params.id });
        if (!deleted) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        return res.status(200).json({ message: "Appointment deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete appointment" });
    }
};