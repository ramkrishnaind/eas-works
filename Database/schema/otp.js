
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    mobile: {
        type: Number,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false
    }
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
    collection: 'otp'
}
);

module.exports = schema;