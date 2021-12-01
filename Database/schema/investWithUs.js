
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    whatWeDoHeader: {
        type: String,
        trim: true
    },
    whatWeDoDescription: {
        type: String,
        trim: true
    },
    howToInvestTitle: {
        type: String,
        trim: true
    },
    media: {
        type: Array
    },
    howToInvest: {
        type: Array
    },
    whatWeDo: {
        type: Array
    },
    date: {
        type: Date,
        default: () => Date.now()
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
    collection: 'investWithUs'
}
);

module.exports = schema;