const mongoose = require('mongoose');
const {Schema} = mongoose;

const routeSchema = new Schema({
    source: {
        type: String, 
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    fare: {
        type: Number,
        required: true,
        min: 10
    },
    stops: [{
        type: String, trim: true,
    }]
}, {timestamps: true});

const Route = mongoose.model("route", routeSchema);
module.exports = Route;