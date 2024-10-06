let express = require('express');
let router = express.Router();
let userController = require('./../controllers/userController');
let authController = require('./../controllers/authController');

router.post('/register',userController.register)
router.get('/check-auth',userController.checkAuth)


module.exports = router
