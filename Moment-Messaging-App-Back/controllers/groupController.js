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
    try {
        // Step 1: Find the group by its ID
        const group = await Group.findOne({ ID: req.body.group });

        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        // Step 1.1: Check if the requesting user is a member of the group
        if (!group.MEMBERS.some(member => member.ID === req.userId)) {
            return res.status(403).json({ message: "You are not a member of the group." });
        }

        // Step 2: Find the member to add by their ID
        const memberToAdd = await User.findOne({ ID: req.body.memberToAdd });
        
        if (!memberToAdd) {
            return res.status(404).json({ message: "Member not found." });
        }

        // Step 3: Check if the member is already in the group
        const isMemberAlreadyInGroup = group.MEMBERS.some(member => member.ID === memberToAdd.ID);
        if (isMemberAlreadyInGroup) {
            return res.status(400).json({ message: "Member is already in the group." });
        }

        // Step 4: Add the member to the group's list of members
        group.MEMBERS.push({
            ID: memberToAdd.ID,
            FIRST_NAME: memberToAdd.FIRST_NAME,
            LAST_NAME: memberToAdd.LAST_NAME
        });

        await group.save();

        // Step 5: Check if the group is already in the member's list of groups
        const isGroupAlreadyInMemberGroups = memberToAdd.GROUPS.includes(group.ID);
        if (!isGroupAlreadyInMemberGroups) {
            // Step 6: Add the group to the member's list of groups
            memberToAdd.GROUPS.push(group.ID);
            await memberToAdd.save();
        }

        res.status(200).json({ message: "Member added to the group successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});