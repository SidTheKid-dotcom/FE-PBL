const JWT_SECRET = require("../../config");
const jwt = require('jsonwebtoken')

function loginMiddleware(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return next();
    }

    if (!auth.startsWith("Bearer ")) {
        return res.status(411).json({
            message: "Please sign in again"
        })
    }
    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded.userID) {
            req.adminID = decoded.adminID;
        }
        else {
            req.userID = decoded.userID;
        }

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

module.exports = loginMiddleware