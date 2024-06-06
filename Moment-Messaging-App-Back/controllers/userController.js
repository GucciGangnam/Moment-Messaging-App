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
const User = require("../models/user")
// Import JWT
const jwt = require("jsonwebtoken");



// CONTROLLERS //
exports.users = (req, res, next) => {
    res.send('respond with a resource');
    return;
}

// Create 
exports.user_create = [
    body("firstName")
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('First name must be between 1 and 30 characters long')
        .matches(/^[A-Za-z\s]+$/, 'g')
        .withMessage('First name must only contain letters and spaces')
        .notEmpty()
        .withMessage('First name is required')
        .custom((value, { req }) => {
            req.body.firstName = value.charAt(0).toUpperCase() + value.slice(1);
            return true;
        }),

    body("lastName")
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Last name must be between 1 and 30 characters long')
        .matches(/^[A-Za-z\s]+$/, 'g')
        .withMessage('Last name must only contain letters and spaces')
        .notEmpty()
        .withMessage('Last name is required')
        .custom((value, { req }) => {
            req.body.lastName = value.charAt(0).toUpperCase() + value.slice(1);
            return true;
        }),

    body("email")
        .trim()
        .isEmail()
        .normalizeEmail({ all_lowercase: true }) // Optional: convert to lowercase
        .withMessage('Invalid email format')
        .notEmpty()
        .withMessage('Email is required'),

    body("password")
        .isLength({ min: 8 })  // Minimum length of 8 characters
        .withMessage('Password must be at least 8 characters long')
        .notEmpty()
        .withMessage('Password is required'),

    // Function to check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

    // Check if email id already assigned to another user.
    async (req, res, next) => {
        try {
            const user = await User.findOne({ EMAIL: req.body.email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'Email is already in use' }] });
            }
            next();
        } catch (err) {
            return res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }
    },

    // // Salt and hash req.body.password
    async (req, res, next) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            next();
        } catch (err) {
            return res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }
    },

    asyncHandler(async (req, res, next) => {
        // Create unique user ID
        const userID = "UID" + uuidv4();
        // Create new user
        const newUser = new User({
            ID: userID,
            FIRST_NAME: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
            LAST_NAME: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
            PHONE: req.body.phone,
            EMAIL: req.body.email,
            PASSWORD: req.body.password
        })
        try {
            console.log(newUser);
            await newUser.save();
            return res.status(200).json({ msg: 'New user created' });
        } catch (error) {
            console.error("failed to create new user");
            return res.status(500).json({ errors: [{ msg: 'Failed to create new user' }] });
        }
    })
]

// Login 
exports.user_login = asyncHandler(async (req, res, next) => {
    // Does user exist?
    const existingUser = await User.findOne({ EMAIL: req.body.email })
    if (!existingUser) {
        // Email not found
        return res.status(400).json({ msg: "Email password combination don't match" });
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(req.body.password, existingUser.PASSWORD);
    if (!passwordMatch) {
        return res.status(400).json({ msg: "Email password combination don't match" });
    }
    // return res.status(200).json({ mag: 'yay' })
    // Create a pay load 
    const payload = {
        userId: existingUser.ID
    }
    // Send access token 
    const secretKey = process.env.API_SECURITY_KEY;
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: '60m' })
    res.status(200).json({ accessToken: accessToken })
    return;
});

// Demo Login 
exports.user_demologin = asyncHandler(async (req, res, next) => {

    // Create unique user ID
    const userID = "UID" + uuidv4();
    // Create new user
    const newUser = new User({
        ID: userID,
        FIRST_NAME: "Demo",
        LAST_NAME: "User",
        PHONE: 555 - 555 - 555,
        EMAIL: userID + '@demo.demo',
        PASSWORD: 12345678,
        IS_DEMO: true
    })
    try {
        console.log(newUser);
        await newUser.save();
                // ADD DEMO FRIENDS

                const receiverContact1 = {
                    ID: 'UIDf57f130f-8229-4af1-a3fc-5e0a16bfed67',
                    FIRST_NAME: 'Demo',
                    LAST_NAME: 'Smith'
                };
                const receiverContact2 = {
                    ID: 'UID23a55896-c5e2-4221-82a2-612998dfc026',
                    FIRST_NAME: 'Demo',
                    LAST_NAME: 'Jones'
                };
                const receiverContact3 = {
                    ID: 'UID5a2130d4-2747-4e18-a830-36b30850b07a',
                    FIRST_NAME: 'Demo',
                    LAST_NAME: 'Doe'
                };

                await User.updateOne(
                    { ID: userID },
                    { $addToSet: { CONTACTS: { $each: [receiverContact1, receiverContact2, receiverContact3] } } }
                );

                ////////////////////
                // CREATE A GROUP 












                ////////////////////
        const payload = {
            userId: userID
        }
        // Send access token 
        const secretKey = process.env.API_SECURITY_KEY;
        const accessToken = jwt.sign(payload, secretKey, { expiresIn: '60m' })
        res.status(200).json({ accessToken: accessToken })
        return;
    } catch (error) {
        console.error("failed to create new user");
        return res.status(500).json({ errors: [{ msg: 'Failed to create new user' }] });
    }
})


// Read user
exports.get_user_info = asyncHandler(async (req, res, next) => {
    console.log("user info passed through");
    // Get user object excluding the PASSWORD field
    const userInfo = await User.findOne({ ID: req.userId }).select('-PASSWORD');
    res.status(200).json({ userInfo: userInfo });
});

// Add Contact 
exports.add_contact = asyncHandler(async (req, res, next) => {
    try {
        // Define sender profile 
        const sender = await User.findOne({ ID: req.userId });
        // Define receiver profile 
        const receiver = await User.findOne({ EMAIL: req.body.contact });
        if (!receiver) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        // Create objects to be added to contacts
        const senderContact = {
            ID: sender.ID,
            FIRST_NAME: sender.FIRST_NAME,
            LAST_NAME: sender.LAST_NAME
        };
        const receiverContact = {
            ID: receiver.ID,
            FIRST_NAME: receiver.FIRST_NAME,
            LAST_NAME: receiver.LAST_NAME
        };

        // Update sender profile CONTACTS by adding receiver's contact object
        await User.updateOne(
            { ID: req.userId },
            { $addToSet: { CONTACTS: receiverContact } }
        );

        // Update receiver profile CONTACTS by adding sender's contact object
        await User.updateOne(
            { EMAIL: req.body.contact },
            { $addToSet: { CONTACTS: senderContact } }
        );

        console.log('Receiver:', receiver);
        res.status(200).json({ msg: 'Contacts updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

exports.remove_contact = asyncHandler(async (req, res, next) => {
    try {
        // Define sender profile 
        const sender = await User.findOne({ ID: req.userId });
        // Define receiver profile 
        const receiver = await User.findOne({ ID: req.body.contact });
        if (!receiver) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        // Create objects to be removed from contacts
        const senderContact = {
            ID: sender.ID,
            FIRST_NAME: sender.FIRST_NAME,
            LAST_NAME: sender.LAST_NAME
        };
        const receiverContact = {
            ID: receiver.ID,
            FIRST_NAME: receiver.FIRST_NAME,
            LAST_NAME: receiver.LAST_NAME
        };

        // Update sender profile CONTACTS by removing receiver's contact object
        await User.updateOne(
            { ID: req.userId },
            { $pull: { CONTACTS: receiverContact } }
        );

        // Update receiver profile CONTACTS by removing sender's contact object
        await User.updateOne(
            { EMAIL: req.body.contact },
            { $pull: { CONTACTS: senderContact } }
        );

        console.log('Receiver:', receiver);
        res.status(200).json({ msg: 'Contacts removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update 

// Delete