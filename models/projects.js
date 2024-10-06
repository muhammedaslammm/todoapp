let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId
    },
    title:{
        type:String,
        unique:true
    },
    created_date:{
        type:Date
    },
    list_of_todos:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Todo'  
    }
    
})

let Project = mongoose.model('Project',Schema);

module.exports = Project;