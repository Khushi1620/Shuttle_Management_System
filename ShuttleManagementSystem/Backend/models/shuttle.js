const mongoose = require('mongoose');
const {Schema} = mongoose;

const shuttleSchema = new Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'route',
    required: true,
  },
  driverName: {
    type: String,
    required: true,
    trim: true,
  },
  currentStatus: {
    type: String,
    enum: ['available', 'trip', 'maintenance'],
    default: 'available',
  }
}, { timestamps: true });

const Shuttle = mongoose.model("shuttle", shuttleSchema);
module.exports = Shuttle;
