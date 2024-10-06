let express = require('express');
let router = express.Router();
let todoController = require('./../controllers/todoController');
let authentication = require('./../middlewares/authentication')

router.route('/')
.post(authentication,todoController.addTodo)

router.route('/:id/:projectid?')
.patch(authentication,todoController.updateTodo)
.delete(authentication,todoController.deleteTodo)

module.exports = router