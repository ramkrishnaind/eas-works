
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const menuModuleSchema = new Schema({
   name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    level: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
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
    collection: 'menuModule'
}
);

module.exports = menuModuleSchema;