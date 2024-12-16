const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "This action is not allowed"});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(err){
        res.status(401).json({massage: "Invalid Token"});
    }
}
module.exports = authMiddleware;