
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupsSchema = new Schema({
    ID: {
        type: String,
        required: true,
    },
    NAME: {
        type: String,
        required: true,
    },
    ROOM_NAME: {
        type: String,
        required: false,
    },
    ROOM_TIMER: { 
        type: Date,
        required: false
    },
    ROOM_CREATOR: {
        type: String,
        required: false,
    },
    ADMIN: {
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
    },
    MEMBERS: {
        type: Array,
        required: true,
    },


}, { collection: 'Groups' }); // Specify the collection name here

// Set the connection explicitly
module.exports = mongoose.model('Group', groupsSchema, 'Groups');