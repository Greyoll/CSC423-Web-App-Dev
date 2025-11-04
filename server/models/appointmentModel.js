const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const appointmentSchema = new Schema ({
    id: Number,
    date: Date,
    startTime: String,
    endTime: String,
    patientId: Number,
    doctorId: Number,
    lastUpdated: {type: Date, default: Date.now} 
});
module.exports = mongoose.model("Appointment", appointmentSchema);