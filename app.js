const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const socketIO  = require('socket.io');

// database
const mongoose = require('mongoose');
const app = express();
app.use(cors());

// routes
const userRoute = require('./routes/user');

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

//models
//const userModel = require('./models/user');

app.use('/user',userRoute);



mongoose.connect('mongodb+srv://verba:verba123@verba.pb1uqfm.mongodb.net/verba?retryWrites=true&w=majority&appName=verba')
.then(()=>{
    console.log('connected');
    app.listen(4000);

})
.catch(err =>{
    console.log(err);
})