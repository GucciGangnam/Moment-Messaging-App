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
            ADMIN: admin.ID,
            MEMBERS: [admin.ID],
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

exports.getGroupById = asyncHandler(async (req, res, next) => {
    let groupObjects = []; // Array to store group objects

    if (Array.isArray(req.body.array)) {
        // Loop through each group ID
        for (const groupId of req.body.array) {
            try {
                const groupObject = await Group.findOne({ ID: groupId });
                if (groupObject) {
                    groupObjects.push(groupObject); // Push the retrieved group object into the array
                } else {
                    console.log(`Group object not found for ID: ${groupId}`);
                }
            } catch (error) {
                console.error(`Error fetching group object for ID ${groupId}:`, error);
            }
        }
    } else {
        console.log('req.body.array is not an array');
    }

    // Send the array of group objects back to the client
    res.status(200).json({ message: 'Group objects retrieved successfully', groups: groupObjects });
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
            await Group.deleteOne({ID: req.body.groupId});
            console.log('Group deleted');
        }

    // Send response
    res.status(200).json({ msg: 'Successfully left the group' });
    return;
})