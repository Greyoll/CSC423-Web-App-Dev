const User = require("../models/userModel");
const jwt = required("jsonwebtoken");

const errorHandling = (err) => {
    console.log("Error: ", err.message);
    let errors = {username: "", password: ""};
    // Wrong username
    if (err.message === "incorrect username") {
        errors.username = "No such user exists";
    }
    // Wrong password
    if (err.message === "incorrect password") {
        errors.password = "No such password exists";
    }
    return errors;
}

modules.exports.loginUser = async (req, res) => {
    const {username, password} = req.body;;

    console.log("Username: ", username);
    console.log("Password: ", password);

    try {
        const user = await User.login(username, password);
        res.json({user:user});
    } catch (err) {
        const errors = errorHandling(err);
        res.status(400).json({ errors });
    }
}