const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN = process.env.JWT_TOKEN;

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Token fehlt"
        });
    }

    if (token !== JWT_TOKEN) {
        return res.status(403).json({
            status: 403,
            message: "Ungültiger Token"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            status: 403,
            message: "Token ist ungültig oder abgelaufen"
        });
    }
}

module.exports = authenticateToken;