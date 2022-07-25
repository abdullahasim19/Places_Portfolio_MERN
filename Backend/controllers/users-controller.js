const{validationResult}=require('express-validator');
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

    if(!existingUser || existingUser.password!==password)
    {
        const error=new HttpError("Login Failed!",401);
        return next(error);
    }

    res.json({message:"Logged in",user:existingUser.toObject({getters:true})});
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

    const createdUser=User({
        name,
        email,
        image:'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
        password,
        places:[]
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError(error,500));
    }
    res.status(201).json({user:createdUser.toObject({getters:true})});
}

exports.getUsers=getUsers;
exports.login=login;
exports.signup=signup;