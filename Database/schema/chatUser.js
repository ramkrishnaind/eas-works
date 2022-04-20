const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    socketId: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        default: ""
    },
    room: {
        type: String,
        default: ""
    },

}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    id: false,
    toJSON: {
        getters: true,
        virtuals: true
    },
    toObject: {
        getters: true,
        virtuals: true
    }
}, {
    collection: 'chatUser'
});

module.exports = schema;
