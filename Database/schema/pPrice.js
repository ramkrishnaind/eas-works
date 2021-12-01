
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property',
        default: null
    },
    expectedPrice: {
        type: Number
    },
    tokenAmount: {
        type: Number
    },
    pricePerSqft: {
        type: Number
    },
    priceIncludes: {
        type: Array
    },
    otherCharges: {
        type: Number
    },
    wishToEnter: {
        type: String
    },
    basicPrice: {
        type: Number
    },
    floorPLC: {
        type: Number
    },
    facingPLC: {
        type: Number
    },
    openCarParking: {
        type: Number
    },
    openCarParkingFree: {
        type: Boolean
    },
    coveredCarParking: {
        type: Number
    },
    coveredCarParkingFree: {
        type: Boolean
    },
    newComponent: {
        type: String
    },
    taxRegistration: {
        type: Boolean
    },
    maintenanceCharge: {
        type: Number
    },
    per: {
        type: String
    },
    maintenanceFor: {
        type: String
    },
    brokerage: {
        type: Number
    },
    bookingAmount: {
        type: Number
    },
    isStumpDutyRCExcluded: {
        type: Boolean
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
    collection: 'pPrice'
}
);

module.exports = schema;