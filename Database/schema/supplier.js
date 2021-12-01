const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    supplierOf: {
        type: String,
        required: true
    },
    file: {
        type: Array
    },
    isActive: {
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
    collection: 'supplier'
}
);

module.exports = schema;