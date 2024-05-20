// Import asyncHandler
const asyncHandler = require("express-async-handler");
// Impiort jwt
const jwt = require('jsonwebtoken');

// CONTROLLER //

// Authenticate JWT - middlewear - pre route
exports.validateAccessToken = asyncHandler(async (req, res, next) => {
    // Get authorization header
    const clientAccessToken = req.headers.authorization
    // if it fails 
    if (!clientAccessToken || !clientAccessToken.startsWith('Bearer ')) {
        // If the authorization token is missing or doesnt start with "bearer", return a 401 Unauthorized response
        return res.status(401).json({ msg: 'Token missing opr not formatted correctly' });
    }
    // Extract the token part from the Authorization header
    const token = clientAccessToken.split(' ')[1];
    try {
        // Verify the token
        const secretKey = process.env.API_SECURITY_KEY;
        const payload = jwt.verify(token, secretKey);
        const userId = payload.userId;
        // Pass user ID to the next middleware or route handler
        req.userId = userId;
        // Proceed to the next middleware
        console.log('Authentification passed')
        next();
    } catch (error) {
        // If the token is invalid or expired, return a 401 Unauthorized response
        console.error(error)
        return res.status(401).json({ msg: 'Unauthorized Access Token' });
    }
})


// Authenticate JWT - STABDALONE
exports.validateAccessTokenStandAlone = asyncHandler(async (req, res, next) => {
    const clientAccessToken = req.headers.authorization;
    if (!clientAccessToken || !clientAccessToken.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Token missing or not formatted correctly' });
    }
    const token = clientAccessToken.split(' ')[1];
    try {
        const secretKey = process.env.API_SECURITY_KEY;
        jwt.verify(token, secretKey); // Verify the token without assigning the result
        return res.status(200).json({ msg: 'Token is valid' });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ msg: 'Unauthorized Access Token' });
    }
});
