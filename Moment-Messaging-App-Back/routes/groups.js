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
// Read: Get all users groups by ID
router.get('/getgroupinfo', authenticator_controller.validateAccessToken, group_controller.getgroupinfo)
// Read: Get a particulat group by ID
router.get('/getSingGroupInfo/:id', authenticator_controller.validateAccessToken, group_controller.getSingGroupInfo)
// UPDATE // 
// leave group 
router.post('/leavegroupbyid', authenticator_controller.validateAccessToken, group_controller.leavegroupbyid)
// Add memebr to group 
router.put('/addgroupmember', authenticator_controller.validateAccessToken, group_controller.addgroupmember)
// Send Message
router.put('/sendmessage', authenticator_controller.validateAccessToken, group_controller.sendmessage)
// PIN Message 
router.put('/pinmessage', authenticator_controller.validateAccessToken, group_controller.pinmessage)


// DELETE //

// Export the router
module.exports = router;