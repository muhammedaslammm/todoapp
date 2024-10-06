let express = require('express');
let router = express.Router();
let authentication = require('./../middlewares/authentication');
let gistController = require('./../controllers/gistController');

router.route('/:id')
.post(authentication,gistController.generateSummaryGist)

module.exports = router