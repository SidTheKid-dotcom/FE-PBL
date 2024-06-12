const { JWT_SECRET_ADMIN, JWT_SECRET_USER } = require("../../config");
const jwt = require('jsonwebtoken')

function authMiddlewareAdmin(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(403).json({
            message: "Your session is over. Please login again"
        });
    }

    if (!auth.startsWith("Bearer ")) {
        return res.status(411).json({
            message: "Please sign in again"
        })
    }
    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET_ADMIN);
        req.adminID = decoded.adminID;

        return next();
    }
    catch(e) {
        if(e.message == 'jwt expired') {
            return res.status(401).json({
                message: "Unauthorized: Token expired"
            })
        }
        else {
            return res.status(411).json({
                message: "Error in decoding JWT"
            })
        }
    }
}

function authMiddlewareUser(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(403).json({
            message: "Your session is over. Please login again"
        });
    }

    if (!auth.startsWith("Bearer ")) {
        return res.status(411).json({
            message: "Please sign in again"
        })
    }
    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET_USER);
        req.userID = decoded.userID;

        return next();
    }
    catch(e) {
        if(e.message == 'jwt expired') {
            return res.status(401).json({
                message: "Unauthorized: Token expired"
            })
        }
        else {
            return res.status(411).json({
                message: "Error in decoding JWT"
            })
        }
    }
}

module.exports = { authMiddlewareAdmin, authMiddlewareUser };