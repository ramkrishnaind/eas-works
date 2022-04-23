const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    users: {
        type: [mongoose.ObjectId]
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
    collection: 'chatRoom'
});

module.exports = schema;
