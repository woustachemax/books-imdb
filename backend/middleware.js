const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authHeader;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(411).json({});
    }

    const token = authHeader.split("")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        decoded.userID = req.userID;
        next();
    }
    catch(err){
        res.status(411).json({})
    }
}

module.exports = {
    authMiddleware
}