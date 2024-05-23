// IMPORTS //
// Async handler
const asyncHandler = require("express-async-handler");
// Validator methods
const { body, validationResult } = require("express-validator");
// UUID v4
const { v4: uuidv4 } = require('uuid');
// Bcrypt
const bcrypt = require('bcryptjs');
// Shemes
const User = require("../models/user");
const Group = require("../models/group");
// Import JWT
const jwt = require("jsonwebtoken");


// CONTROLLER //
exports.create_group = asyncHandler(async (req, res, next) => {
    try {
        // Find the admin user
        const admin = await User.findOne({ ID: req.userId });
        // Create and save the new group
        const newGroup = await Group.create({
            ID: "GID" + uuidv4(),
            NAME: req.body.groupName,
            ROOM_NAME: req.body.groupName,
            ADMIN: {
                ID: admin.ID,
                FIRST_NAME: admin.FIRST_NAME,
                LAST_NAME: admin.LAST_NAME,
            },
            MEMBERS: [{
                ID: admin.ID,
                FIRST_NAME: admin.FIRST_NAME,
                LAST_NAME: admin.LAST_NAME,
            }],
        });
        // Add the group to the admin's groups array 
        admin.GROUPS.push(newGroup.ID);
        await admin.save();
        return res.status(200).json({ msg: 'Group created successfully' });
    } catch (error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ msg: 'Failed to create group' });
    }
});











// Get group by id

exports.getgroupinfo = asyncHandler(async (req, res, next) => {
    try {
        const userGroups = [];

        // req.userId is the user we are fetching for 
        const user = await User.findOne({ ID: req.userId });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Get all the IDs of their groups 
        const arrayOfgroupIdStrings = user.GROUPS;

        // Use a for...of loop to handle the asynchronous operation
        for (const groupId of arrayOfgroupIdStrings) {
            const groupObject = await Group.findOne({ ID: groupId });
            userGroups.push(groupObject);
        }

        // Send a response with the list of group objects
        res.status(200).json({ groups: userGroups });
    } catch (error) {
        // Handle any errors that might have occurred
        next(error);
    }
});





















exports.leavegroupbyid = asyncHandler(async (req, res, next) => {
    // Find the user by ID
    const userObject = await User.findOne({ ID: req.userId })
    if (!userObject) {
        res.status(404).json({ msg: 'Your user Id isn\'t found' })
        return;
    }

    // Find the group by ID
    const groupObject = await Group.findOne({ ID: req.body.groupId })
    if (!groupObject) {
        res.status(404).json({ msg: 'The group ID isn\'t found' })
        return;
    }

    // Remove groupId from userObject.GROUPS
    userObject.GROUPS.pull(req.body.groupId);
    await userObject.save();
    console.log('group removed from user')

    // Remove userId from groupObject.MEMBERS
    groupObject.MEMBERS.pull(req.userId);
    await groupObject.save();
    console.log('user removed from group')

    // console.log('groupObject.MEMBERS:', groupObject.MEMBERS);
    // console.log('req.userId:', req.userId);

    // Once that's done, if groupObject.MEMBERS is empty, delete the entire group

    if (groupObject.MEMBERS.length === 0 || (groupObject.MEMBERS.length === 1 && groupObject.MEMBERS.includes(req.userId))) {
        await Group.deleteOne({ ID: req.body.groupId });
        console.log('Group deleted');
    }

    // Send response
    res.status(200).json({ msg: 'Successfully left the group' });
    return;
})

// Add Member To Group By ID
exports.addgroupmember = asyncHandler(async (req, res, next) => {

    // Get group object based on the provided groupID
    const group = await Group.findOne({ ID: req.body.groupID });

    // Get memberToAdd object based on the provided memberToAddID
    const memberToAdd = await User.findOne({ ID: req.body.memberToAddID });

    // Check if both group and memberToAdd are found
    if (group && memberToAdd) {
        // Check if the member is already in the group's MEMBERS array
        if (group.MEMBERS.includes(req.body.memberToAddID)) {
            return res.status(400).json({ message: "Member is already in the group" });
        }

        // Check if the group is already in the member's GROUPS array
        if (memberToAdd.GROUPS.includes(req.body.groupID)) {
            return res.status(400).json({ message: "Group is already in the member's groups" });
        }

        // Push req.body.memberToAddID to group.MEMBERS array
        group.MEMBERS.push(req.body.memberToAddID);
        await group.save(); // Save the updated group object

        // Push req.body.groupID to memberToAdd.GROUPS array
        memberToAdd.GROUPS.push(req.body.groupID);
        await memberToAdd.save(); // Save the updated memberToAdd object

        res.status(200).json({ message: "Member added to group successfully" });
    } else {
        // If either the group or the member to add is not found, return a 404 status with an appropriate error message.
        let errorMessage = "";
        if (!group) errorMessage += "Group not found. ";
        if (!memberToAdd) errorMessage += "Member to add not found. ";
        res.status(404).json({ message: errorMessage });
    }
});