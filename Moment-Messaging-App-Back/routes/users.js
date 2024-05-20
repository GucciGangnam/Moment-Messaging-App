var express = require('express');
var router = express.Router();

// CONTROLLERS
const user_controller = require('../controllers/userController');
const authenticator_controller = require('../controllers/authenticatorController')

/* GET users listing. */
router.get('/', user_controller.users);

// Create user //
router.post('/new', user_controller.user_create);

// log in user //
router.post('/login', user_controller.user_login);

// get user account info //
router.get('/account', authenticator_controller.validateAccessToken, user_controller.get_user_info);

module.exports = router;
