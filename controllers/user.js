const path = require("path");
const rootDir = require("../utils/path");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const MongoUser = require('../models/user');

function generateToken(id){

  return jwt.sign({id: id}, 'secretKey');
}

exports.postLogin = async (req, res, next) => {
  try {

    const user = await MongoUser.find({email: req.body.email});

    if (user.length === 0) {
      res.status(401).json({ message: "user not exist" });
    } else{

        bcrypt.compare(req.body.password, user[0].password, async (err, result)=>{

            console.log("err", err);
            
            if(result === true){
                res.status(201).json({message: "login successfully",userName: user[0].name, isPremiumUser: user[0].isPremiumUser, token: generateToken(user[0]._id)});
            }
            else{
                res.status(401).json({message: "password did not match"});
            }
        })

    }
  } catch (err) {
    console.log(err);
  }
};

exports.postSignUp = async (req, res, next) => {
  try {

    const isUser = await MongoUser.find({email: req.body.email});

    if (isUser.length === 0) {

        bcrypt.hash(req.body.password, 10, async (err, hash)=>{

            console.log(err);

            let mongoUser = new MongoUser({
              name: req.body.name, 
              email: req.body.email,
              password: hash,
              isPremiumUser: false,
              totalExpense: 0
            });

            let user = await mongoUser.save();

            res.status(201).json({ user: user });

        })
    } else {
      res.status(403).json({ user: "userExist" });
    }
  } catch (err) {

    console.log(err);
    res.status(500).json(err);
  }
};