const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes =  require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
// app.use(express.static(path.join(__dirname, "../client/public")));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true
}));

// Auth routes
app.use("/api/auth", authRoutes);
// User CRUD routes
app.use("/api/users", userRoutes);
// Appointment CRUD routes
app.use("/api/appointments", appointmentRoutes);

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to DB"))
    .catch(error => {
        console.error("Could not connect to DB: ", error);
        process.exit(1);
    })

/*
// Default route for login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});
*/

// Fallback route for 404s
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});