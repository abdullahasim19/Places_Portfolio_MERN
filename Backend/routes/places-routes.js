const express = require('express');
const router=express.Router();
const {check}=require('express-validator');
const fileUpload=require('../middleware/file-upload');
const placesController=require('../controllers/places-controller');


router.get('/:pid',placesController.getPlaceById); //find place by its id


router.get('/user/:uid',placesController.getPlacesByUserId); //find place by user id

// adding validations
router.post('/',
fileUpload.single('image'),
[
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty()
],placesController.createPlace); //add a place

router.patch('/:pid',
[
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
],
placesController.updatePlace); //update a place

//----

router.delete('/:pid',placesController.deletePlace) //delete a place

module.exports=router;