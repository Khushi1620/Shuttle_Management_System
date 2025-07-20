const express = require('express');
const routeRouter = express.Router();
const {addRoute, getAllRoutes, getRouteById, updateRouteById, deleteRouteById} = require('../controllers/routeFunctionalitiesImplementation');
const adminMiddleware = require('../middleware/adminMiddleware');

routeRouter.post('/add', adminMiddleware, addRoute);
routeRouter.get('/getAllRoute', getAllRoutes);
routeRouter.get('/getRoute/:id', getRouteById);
routeRouter.patch('/update/:id',adminMiddleware, updateRouteById);
routeRouter.delete('/delete/:id', adminMiddleware, deleteRouteById);
module.exports = routeRouter;