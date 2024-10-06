let User = require('./../models/userModel');


// check auth
exports.checkAuth = function(req,res){
    console.log(req.session.userID);
    if(req.session.userID){                
        res.json({isLoggedIn:true})
    }
    else{
        res.json({isLoggedIn:false})
    }
}

// signup
exports.register = async function(req,res){
    try{
        let matchingUser = await User.findOne({username:req.body.username});
        if(matchingUser){
            return res.status(409).json({
                status:'fail',
                message:'Username already in use'
            })
        }
        let newUser = await User.create(req.body);
        req.session.userID = newUser._id;        
        res.status(201).json({
            status:'success',
            message:'success'
        })
    }
    catch(error){
        res.status(500).json({
            status:'failed',
            message:'registration failed'
        })
    }
}