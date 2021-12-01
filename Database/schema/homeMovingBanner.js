
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    years: {
        type: Number,
        required: true
    },
    projects: {
        type: Number,
        required: true
    },
    clients: {
        type: Number,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: () => Date.now()
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
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
    collection: 'homeMovingBanner'
}
);

module.exports = schema;