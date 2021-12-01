const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    propertyType: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    propertyAddress: {
        type: String,
        required: true
    },
    propertyCity: {
        type: String,
        required: true
    },
    propertyState: {
        type: String,
        required: true
    },
    propertyLocation: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    totalArea: {
        type: Number,
        required: true
    },
    image: {
        type: Array
    },
    active: {
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
    collection: 'serviceEnquiry'
});

module.exports = schema;
