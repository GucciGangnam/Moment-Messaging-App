var express = require('express');
var router = express.Router();

// CONTROLLERS
const user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', user_controller.users);

router.post('/', user_controller.user_create);

module.exports = router;
