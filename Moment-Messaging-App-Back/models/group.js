
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
    ADMIN: {
        type: String,
        required: true,
    },
    MEMBERS: {
        type: Array,
        required: true,
    },


}, { collection: 'Groups' }); // Specify the collection name here

// Set the connection explicitly
module.exports = mongoose.model('Group', groupsSchema, 'Groups');