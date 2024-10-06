let mongoose = require('mongoose');
let Schema = new mongoose.Schema({
    description:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    },
    createdDate:{
        type:Date
    },
    updatedDate:{
        type:Date,
        default:null
    }
})

let Todo = mongoose.model('Todo',Schema);

module.exports = Todo