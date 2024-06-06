
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    ID: {
        type: String,
        required: true,
    },
    FIRST_NAME: {
        type: String,
        required: true,
    },
    LAST_NAME: {
        type: String,
        required: true,
    },
    PHONE: {
        type: Number,
        required: false,
    },
    EMAIL: {
        type: String,
        required: true,
    },
    PASSWORD: {
        type: String,
        required: true,
    },
    CONTACTS: {
        type: Array,
        required: false,
    },
    GROUPS: {
        type: Array,
        required: false,
    },
    IP_ADDRESSES: {
        type: Array,
        required: false
    },
    IS_DEMO: { 
        type: Boolean,
        required: false
    }
}, { collection: 'Users' }); // Specify the collection name here

// Set the connection explicitly
module.exports = mongoose.model('User', usersSchema, 'Users');