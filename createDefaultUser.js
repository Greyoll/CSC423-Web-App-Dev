const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ username: "stanley" });
        if (existing) {
            console.log("Default user already exists");
            mongoose.connection.close();
            return;
        }

        const user = new User({
            username: "stanley",
            password: "GMoney527",
            role: "patient"
        });

        await user.save();
        console.log("Default user created!");
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
