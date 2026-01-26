const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, "SECRET123");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
