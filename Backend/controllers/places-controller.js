const{validationResult}=require('express-validator');
const getCoordinates=require('../utils/location');
const mongoose=require('mongoose');
const HttpError=require('../models/http-error');
const Place=require('../models/place');
const User=require('../models/user');
const fs=require('fs');
  
const getPlaceById=async (req,res,next)=>{
    const placeId=req.params.pid.trim(); //{pid:p1}
    let place;
    try {
      place=await Place.findById(placeId); //fetching from database
    } catch (error) {
      const e=new HttpError("Error while fetching from database",500);
      next(error);
    }
    if(!place)
    {
      next(new HttpError("Cannot find place of the specified id",404));
    }
    res.json({place:place.toObject({getters:true})}); //getters is used to get id as a string
}

const getPlacesByUserId=async (req,res,next)=>{
    const userId=req.params.uid;
    let place;
    try {
      place=await Place.find({creator:userId});
    } catch (error) {
      next(new HttpError(error,500));
    }
    
    if(!place || place.length===0)
    {
      return next(new HttpError("Cannot find place of the specified user id",404));
    }
    res.json({places:place.map(p=>p.toObject({getters:true}))});
}

const createPlace=async (req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty())
  {
      return next(new HttpError("Invalid Inputs",422));
  }
    const {title,description,address,creator}=req.body;

    const coordinates=getCoordinates();
    const createdPlace=Place({
      title,
      description,
      address,
      location:coordinates,
      image: req.file.path,
      creator
    });

    let existingUser;
    try {
      existingUser=await User.findById(creator); //checking if creator of place exists or not
    } catch (error) {
      return next(HttpError(error,500));
    }

    if(!existingUser)
    {
      return next(new HttpError('Could not find userId'),404);
    }

   try {
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session:sess}); //storing the place 
    existingUser.places.push(createdPlace); //adding the place in users also
    await existingUser.save({session:sess});//storing the updated user
    await sess.commitTransaction();

   } catch (error) {
      e=new HttpError(error,500);
      next(e);
   }
  
    res.status(201).json({place:createdPlace});
}

const updatePlace=async (req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty())
  {
      return next(new HttpError("Invalid Inputs",422));
  }

  const{title,description}=req.body;
  const placeId=req.params.pid.trim();

  let place;
  try {
    place=await Place.findById(placeId); //fetching the place
  } catch (error) {
    return next(new HttpError(error,500));
  }
  if(!place)
  {
    return next(new HttpError('Could not find place',404));
  }
  if(place.creator.toString()!==req.userData.userId)
  {
    return next(new HttpError('You are not allowed to updated this place',401));
  }

  place.title=title;
  place.description=description;

 try {
    await place.save();
 } catch (error) {
    return next(new HttpError(error,500));
 }

  res.status(200).json({place:place.toObject({getters:true})});
}

const deletePlace=async (req,res,next)=>{
  const placeId=req.params.pid.trim();

  let place;
  try {
    place=await Place.findById(placeId).populate('creator'); //fetching the place

  } catch (error) {
    return next(new HttpError(error,500));
  }

  if(!place)
  {
    return next(new HttpError('Place to be deleted not found',404));
  }

  if(place.creator.id!==req.userData.userId)
  {
    return next(new HttpError('You are not allowed to Delete this place',401)); 
  }
  const imagePath=place.image;

  try {
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session:sess}); //removing the place
    place.creator.places.pull(place);
    await place.creator.save({session:sess}); //also removing place from the user collection
    await sess.commitTransaction();

  } catch (error) {
    next(new HttpError(error,500));
  }

  fs.unlink(imagePath,(err)=>{
    err&&console.log(err);
  })
  res.status(200).json({message:"Place deleted successfuly"});

}

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.updatePlace=updatePlace;
exports.deletePlace=deletePlace;