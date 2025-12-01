const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

// Helper function to check if two time ranges overlap
const timesOverlap = (start1, end1, start2, end2) => {
    // Convert times to comparable format (minutes from midnight)
    const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };
    
    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);
    
    // Check if ranges overlap: start1 < end2 AND start2 < end1
    return s1 < e2 && s2 < e1;
};

// Helper function to check for conflicting appointments
const checkConflict = async (date, startTime, endTime, doctorId, excludeId = null) => {
    // Normalize date to compare only date part (ignore time)
    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));
    
    // Find all appointments for the same doctor on the same day
    const query = {
        doctorId: doctorId,
        date: { $gte: startOfDay, $lte: endOfDay }
    };
    
    // Exclude current appointment when editing
    if (excludeId !== null) {
        query.id = { $ne: excludeId };
    }
    
    const existingAppointments = await Appointment.find(query);
    
    // Check if any existing appointment overlaps with the new time slot
    for (const apt of existingAppointments) {
        if (timesOverlap(startTime, endTime, apt.startTime, apt.endTime)) {
            return {
                conflict: true,
                message: `Time conflict: Doctor already has an appointment from ${apt.startTime} to ${apt.endTime} on this date`
            };
        }
    }
    
    return { conflict: false };
};

// Create appointment 
module.exports.createAppointment = async (req, res) => {
    try {
        const { date, startTime, endTime, patientId, doctorId } = req.body;

        // Make sure all fields are filled
        if (!date || !startTime || !endTime || !patientId || !doctorId) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }

        // Check for time conflicts
        const conflictCheck = await checkConflict(date, startTime, endTime, doctorId);
        if (conflictCheck.conflict) {
            return res.status(409).json({ error: conflictCheck.message });
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
        const appointmentId = parseInt(req.params.id);
        const { date, startTime, endTime, doctorId } = req.body;

        // Check for time conflicts (excluding the current appointment being edited)
        if (date && startTime && endTime && doctorId) {
            const conflictCheck = await checkConflict(date, startTime, endTime, doctorId, appointmentId);
            if (conflictCheck.conflict) {
                return res.status(409).json({ error: conflictCheck.message });
            }
        }

        const updates = { ...req.body, lastUpdated: new Date() };
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