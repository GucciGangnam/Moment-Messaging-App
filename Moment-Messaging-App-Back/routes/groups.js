var express = require('express');
var router = express.Router();

// CONTROLLERS //
const user_controller = require('../controllers/userController');
const authenticator_controller = require('../controllers/authenticatorController');
const group_controller = require('../controllers/groupController');

///// ROUTRS ////

// CREATE // 
router.post('/creategroup', authenticator_controller.validateAccessToken, group_controller.create_group)

// READ // 
// Read: Get a particular group by ID
router.get('/getgroupinfo', authenticator_controller.validateAccessToken, group_controller.getgroupinfo)

// UPDATE // 
// leave group 
router.post('/leavegroupbyid', authenticator_controller.validateAccessToken, group_controller.leavegroupbyid)
// Add memebr to group 
router.put('/addgroupmember', authenticator_controller.validateAccessToken, group_controller.addgroupmember)

// DELETE //

// Export the router
module.exports = router;