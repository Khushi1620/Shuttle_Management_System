const express = require('express');
const bookingRouter = express.Router();
const {tripBooking, getMyTrip, cancelTrip, checkAvailability, getTripHistory} = require('../controllers/bookingControllers');
const userMiddleware = require('../middleware/userMiddleware');

bookingRouter.post('/book',userMiddleware, tripBooking);
bookingRouter.get('/getTrips',userMiddleware, getMyTrip);
bookingRouter.post('/availability', checkAvailability);
bookingRouter.put('/cancel/:id',userMiddleware, cancelTrip);
bookingRouter.get('/tripHistory', userMiddleware, getTripHistory);

module.exports = bookingRouter;