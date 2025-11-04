const Appointment = require("../models/appointmentModel");

// Create appointment 
module.exports.createAppointment = async (req, res) => {
    try {
        const { date, startTime, endTime, patientId, doctorId } = req.body;

        // Make sure all fields are filled
        if (!date || !startTime || !endTime || !patientId || !doctorId) {
            return res.status(400).json({ error: "Please fill in all fields" });
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

        if (role === "patient") {
            let appointments = await Appointment.find({ patientId: userId });
        } 
        else if (role === "doctor") {
            let appointments = await Appointment.find({ doctorId: userId });
        }
        else if (role === "admin") {
            let appointments = await Appointment.find();
        }
        else {
            return res.status(403).json({ error: "Unauthorized role, how did you even get here????" });
        }

        return res.status(200).json(appointments);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: "An error has occured when trying to fetch users, check console" });
    }
};

// Update appointment
module.exports.updateAppointment = async (req, res) => {
    try {
        const updates = { ...req.body, lastUpdated: new Date() };
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { id: req.params.id },
            updates,
            { new: true }
        );
        if (!updatedAppointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }
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