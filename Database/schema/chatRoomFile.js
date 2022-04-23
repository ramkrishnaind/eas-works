const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom',
        default: null
    },
    messages: [{
        userId: mongoose.Schema.Types.ObjectId,
        fileUrl: String,
        createdAt: { type: Date, default: new Date() }
    }]
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
    collection: 'chatRoomFile'
});

module.exports = schema;
