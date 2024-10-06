let express = require('express');
let router = express.Router();
let homeController = require('./../controllers/homeController');
let authentication = require('./../middlewares/authentication')

router.use('id',homeController.checkID)

router.route('/')
.get(homeController.getAllProjects)
.post(authentication,homeController.createProject)

router.route('/:id')
.get(homeController.getProject)
.delete(authentication,homeController.deleteProject)
.patch(authentication,homeController.editProject)

module.exports = router