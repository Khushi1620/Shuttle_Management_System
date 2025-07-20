const express = require('express');
const shuttleRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {addShuttle, getAllShuttles, getShuttleById, updateShuttle, deleteShuttle, updateStatus} = require('../controllers/shuttleFunctions');

shuttleRouter.post('/add', adminMiddleware, addShuttle);
shuttleRouter.get('/get', getAllShuttles);
shuttleRouter.get('/get/:id', getShuttleById);
shuttleRouter.patch('/update/:id',adminMiddleware, updateShuttle);
shuttleRouter.delete('/delete/:id', adminMiddleware, deleteShuttle);
shuttleRouter.patch('/updateStatus/:id', updateStatus);

module.exports = shuttleRouter;