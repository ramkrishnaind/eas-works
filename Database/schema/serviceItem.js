const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    title: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
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
    media: {
        type: Array
    },
    isDisable: {
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
    collection: 'serviceItem'
});

module.exports = schema;
