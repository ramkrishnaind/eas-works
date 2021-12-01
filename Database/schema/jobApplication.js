
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    qualification: {
        type: String,
        required: true,
        trim: true
    },
    careerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'career',
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String
    },
    resume: {
        type: Array
    },
    mobile: {
        type: Number,
        required: true,
        trim: true
    },
    status: {
        type: Number,
        default: 1
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
    collection: 'jobApplication'
}
);

module.exports = schema;