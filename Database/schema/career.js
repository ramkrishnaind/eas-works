
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    degination: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    vacancy: {
        type: Number,
        required: true,
        trim: true
    },
    experiance: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    desctiption: {
        type: String,
        required: true
    },
    metaTitle: {
        type: String
    },
    metaKeywords: {
        type: String
    },
    metaDescription: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt:'createdAt',
        updatedAt:'updatedAt'
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
    collection: 'career'
}
);

module.exports = schema;