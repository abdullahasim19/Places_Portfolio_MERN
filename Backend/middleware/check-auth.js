const HttpError = require("../models/http-error")
const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(' ')[1];
        if(!token)
        {
         throw new Error('Authentication Failed');
        }
        const decodedToken=jwt.verify(token,'verysecret');
        req.userData={userId:decodedToken.userId};
        next();

    } catch (error) {
        return next(new HttpError('Authentication Failed',401));
    }
}