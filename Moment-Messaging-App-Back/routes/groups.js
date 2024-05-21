var express = require('express');
var router = express.Router();

// CONTROLLERS //
const user_controller = require('../controllers/userController');
const authenticator_controller = require('../controllers/authenticatorController');
const group_controller = require('../controllers/groupCntroller');

///// ROUTRS ////

// CREATE // 
router.post('/creategroup', authenticator_controller.validateAccessToken, group_controller.create_group)

// READ // 
// Read: Get a particular group by ID
router.post('/getgroupbyid', authenticator_controller.validateAccessToken, group_controller.getGroupById)

// UPDATE // 
// leave group 
router.post('/leavegroupbyid', authenticator_controller.validateAccessToken, group_controller.leavegroupbyid)

// DELETE //

// Export the router
module.exports = router;