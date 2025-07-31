const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
    },
    password:{
        type: String
    },
    isPremiumUser: Boolean,
    totalExpense: Number
});

module.exports = mongoose.model('user', userSchema);