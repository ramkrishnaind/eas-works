const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    position: {
        type: String,
        required: true
    },
    pageName: {
        type: String,
        required: false,
        default: null
    },
    type: {
        type: String
    },
    pageUrl: {
        type: String
    },
    pageTitle: {
        type: String
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
    image: {
        type: Array
    },
    pageSortDescription: {
        type: String
    },
    pageDescription: {
        type: String
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
    collection: 'cms'
}
);

module.exports = schema;