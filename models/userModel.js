let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

Schema.pre('save',function(next){
    if(this.isModified('password')){
        bcrypt.hash(this.password,12)
        .then(hashedpass => {
            this.password = hashedpass;
            next()
        })
    }
    else{
        next()
    }
})

module.exports = mongoose.model('User',Schema);