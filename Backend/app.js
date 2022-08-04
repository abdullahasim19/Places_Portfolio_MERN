const express = require('express')
const bodyParser = require('body-parser');
const placesroutes=require('./routes/places-routes');
const usersroutes=require('./routes/users-routes');
const HttpError = require('./models/http-error');
const mongoose=require('mongoose');
const fs=require('fs');
const path=require('path');

const connectionString=`mongodb+srv://${process.env.DB_USER.toLowerCase()}:${process.env.DB_PASS}@cluster0.4oyzq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places',placesroutes);
app.use('/api/users',usersroutes);

//checking for invalid routes
app.use((req,res,next)=>{
    const error=new HttpError('Could not find this route',404);
    throw error;
})

//this will execute if any error is thrown
app.use((err,req,res,next)=>{ //error handling
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
           err&& console.log(err);
        });
    }
    if(res.headerSend)
    {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({message:err.message}||'Unknown error occured')
})

mongoose.connect(connectionString)
.then(app.listen(5000))
.catch(err=>{
    console.log("Connection error");
    console.log(err)
})
