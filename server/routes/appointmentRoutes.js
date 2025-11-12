const express = require("express");
const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");
const tokenValidator = require("../middleware/tokenValidator");

const router = express.Router();

// Create appointment
router.post("/", tokenValidator, createAppointment);
// Get appointments
router.get("/:user", tokenValidator, getAppointments);
// Update appointments
router.put("/:id", tokenValidator, updateAppointment);
// Delete appointments
router.delete("/:id", tokenValidator, deleteAppointment);

module.exports = router;