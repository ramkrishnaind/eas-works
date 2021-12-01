const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newsletterSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
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
},
    {
        collection: 'newsLetterSubscribers'
    }
);
module.exports = newsletterSchema;
