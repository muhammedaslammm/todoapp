function authentication(req,res,next){
    if(req.session.userID){
        next()
    }else{
        res.status(401).json({
            status:'fail',
            message:'authentication fail'
        })
    }
}

module.exports = authentication