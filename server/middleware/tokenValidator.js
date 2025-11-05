const jwt = require("jsonwebtoken")

// Validate the token
function tokenValidator (req, res, next) {
    try {
        // This will look like: "Authorization: Bearer <token>"
        const authHeader = req.headers.authorization;

        // No token found
        if (!authHeader) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Remove Bearer from authHeader
        const token = authHeader.split(" ")[1];

        // Make sure the formatted correctly
        if (!token) {
            return res.status(401).json({ error: "Invalid format for token" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        // Leave decoded data in user data so it can be used later
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid/expired token" });
    }
}

module.exports = tokenValidator;