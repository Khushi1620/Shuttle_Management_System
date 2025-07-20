const Shuttle = require('../models/shuttle');
const Booking = require('../models/booking');
const Route = require('../models/routeSchema');
const User = require('../models/user');

const tripBooking = async (request, response) => {
    try {
    const {shuttleId, routeId, tripDate} = request.body;
    const userId = request.user.id;
    if(! userId) {
        throw new Error("User does not exist...!!!");
    }
    const route = await Route.findById(routeId);
    if(! route) {
        throw new Error("Route not exist...!!!");
    }
    const existingBooking = await Booking.findOne({ userId, shuttleId, routeId, tripDate });
    if (existingBooking) {
        throw new Error("You have already booked this trip...!!!");
    }
    const shuttle = await Shuttle.findById(shuttleId);
    if(! shuttle) {
        throw new Error("Shuttle is not available...!!!");
    }
    const totalBooking = await Booking.countDocuments({
      shuttleId,
      tripDate,
      status: 'booked'
    });

    if (totalBooking >= shuttle.capacity) {
      throw new Error("Shuttle is already full...!!!");
    }
    const fare = route.fare;
    const user = await User.findById(userId);
    if(user.walletBalance < fare) {
        throw new Error("Insufficient wallet balance...!!!");
    }
    user.walletBalance = user.walletBalance - fare;
    await user.save();
    const booking = await Booking.create({userId, shuttleId, routeId, tripDate, fare});
    response.status(200).send({message: "Trip booked successfully", booking: booking});
    } catch(error) {
        response.status(400).send("Error in tripBooking: "+error.message);
    }
}
const getMyTrip = async (request, response)=> {
    try{
     const userId = request.user.id;
     const myTrips = await Booking.find({userId}).populate('shuttleId', 'busNumber driverName').populate('routeId', 'source destination fare');
     response.status(200).send(myTrips);
    } catch(error) {
        response.status(401).send("Error in egtMyTrip: " + error.message);
    }
}
const cancelTrip = async (request, response)=> {
try{
     const bookingId = request.params.id;
     const userId = request.user.id;
     const booking = await Booking.findById(bookingId);
     if(! booking) {
        throw new Error("Booking not found...!!!");
     }
     if(booking.userId != userId) {
        throw new Error("Invalid credentials...!!!");
     }
     if(booking.status == 'cancelled') {
        throw new Error("Booking is already cancelled...!!!");
     }
     if(booking.status == 'completed') {
        throw new Error("Booking is completed...!!!");
     }
     booking.status = 'cancelled';
     await booking.save();
     const user = await User.findById(userId);
     user.walletBalance = user.walletBalance + booking.fare;
     await user.save();
     response.status(200).send("Booking cancelled and fare refunded successfully...!!!");
    } catch(error) {
        response.status(401).send("Error in cancelTrip: " + error.message);
    }
}
const checkAvailability = async (request, response)=> {
try{
    const {shuttleId, tripDate} = request.body;
    if(! shuttleId || ! tripDate) {
        throw new Error("Required field missing...!!!");
    }
    const shuttle = await Shuttle.findById(shuttleId);
    if(! shuttle) {
        throw new Error("Shuttle not found...!!!");
    }
    const totalBooking = await Booking.countDocuments({shuttleId, tripDate, status:'booked'});
    if(totalBooking >= shuttle.capacity) {
        throw new Error("Shuttle has already full...!!!");
    }
    response.status(200).send({message: "Seats are available",availableSeats: shuttle.capacity - totalBooking});

    } catch(error) {
        response.status(401).send("Error in preventOverbooking: " + error.message);
    }
}
const getTripHistory = async (request, response)=> {
    try {
       const userId = request.user.id;
       const trips = await Booking.find({userId}).populate('routeId', 'source destination');
       if(! trips) {
        throw new Error("Trips are not found...!!!");
       }
       response.status(200).send(trips);
    } catch(error) {
        response.status(400).send("Error in getTripHistory is: "+ error.message);
    }
}
module.exports = {tripBooking, getMyTrip, cancelTrip, checkAvailability, getTripHistory};