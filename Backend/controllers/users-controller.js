const{validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const HttpError=require('../models/http-error');
const User=require('../models/user');

const getUsers=async(req,res,next)=>{
   let users;
   try {
        users=await User.find({},'-password');
        //=await User.find({},'email name');
   } catch (error) {
        return next(new HttpError(error,500));
   }
   res.json({users:users.map(u=>u.toObject({getters:true}))});
}

const login=async (req,res,next)=>{
    const {email,password}=req.body;

    let existingUser;
    try {
        existingUser=await User.findOne({email:email}); //checking if user already exists
    } catch (error) {
        return next(new HttpError(error,500));
    }

    if(!existingUser)
    {
        const error=new HttpError("Login Failed!",401);
        return next(error);
    }
    let isValidPassword=false;

    try {
        isValidPassword=await bcrypt.compare(password,existingUser.password);
    } catch (error) {
        return next(new HttpError("Server error"),500);
    }

    if(!isValidPassword)
    {
        const error=new HttpError("Login Failed!",401);
        return next(error);
    }

    let token;
    try {
        token=jwt.sign({userId:existingUser.id,email:existingUser.email},'verysecret',{expiresIn:'1h'});
    } catch (error) {
        return next(new HttpError(error,500));   
    }


    res.json
    ({
        userId:existingUser.id,email:existingUser.email,token:token
    });
}

const signup=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return next(new HttpError("Invalid Inputs",422));
    }
    
    const {name,email,password}=req.body;

    let existingUser;
    try {
        existingUser=await User.findOne({email:email}); //checking if user already exists
    } catch (error) {
        return next(new HttpError(error,500));
    }
    if(existingUser)
    {
        const error=new HttpError(
            'User already exists',422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword=await bcrypt.hash(password,12);
    } catch (error) {
       return next(new HttpError("Server error",500));
    }
  
    const createdUser=User({
        name,
        email,
        image:req.file.path,
        password:hashedPassword,
        places:[]
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError(error,500));
    }

    let token;
    try {
        token = jwt.sign({userId:createdUser.id,email:createdUser.email},'verysecret',{expiresIn:'1h'});
    } catch (error) {
        return next(new HttpError(error,500));   
    }

    
    res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token});
}

exports.getUsers=getUsers;
exports.login=login;
exports.signup=signup;