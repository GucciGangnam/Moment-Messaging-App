var express = require('express');
var router = express.Router();

// CONTROLLERS
const user_controller = require('../controllers/userController');
const authenticator_controller = require('../controllers/authenticatorController')

/* GET users listing. */
router.get('/', user_controller.users);

// CREATE //
// Create user //
router.post('/new', user_controller.user_create);
// log in user //
router.post('/login', user_controller.user_login);
// Auto Login user if they revisit the site with a valid access token
router.get('/login', authenticator_controller.validateAccessTokenStandAlone)

// READ //
// get user account info //
router.get('/account', authenticator_controller.validateAccessToken, user_controller.get_user_info);


// UPDATE //
// Add Contact 
router.put('/addcontact', authenticator_controller.validateAccessToken, user_controller.add_contact)
// Remove Contact 
router.put('/removecontact', authenticator_controller.validateAccessToken, user_controller.remove_contact)

// DELETE //

module.exports = router;
