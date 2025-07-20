const mongoose = require('mongoose');
const {Schema} = mongoose;

const bookingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  shuttleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shuttle',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'route',
    required: true,
  },
  tripDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked',
  },
  fare: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;
