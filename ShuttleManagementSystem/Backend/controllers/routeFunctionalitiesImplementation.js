const { request } = require('express');
const Route = require('../models/routeSchema');

const addRoute = async (request, response)=> {
    try {
      const {source, destination, fare} = request.body;
      if(! source || ! destination || ! fare) {
        throw new Error("Required field missing...!!!");
      }
      const newSource = source.trim().toLowerCase();
        const newDestination = destination.trim().toLowerCase();
        if(newSource === newDestination) {
          throw new Error("Source and destination should not be same...!!!");
        }
     const existingRoute = await Route.findOne({source:newSource, destination:newDestination});
     if(existingRoute) {
        throw new Error("Route is already exists...!!!");
     }
     const newRoute = await Route.create({source:newSource, destination:newDestination, fare});
     response.status(200).send({message: "Route added successfully", route: newRoute});
    } catch(error) {
        response.status(400).send("Error in addRoute: " + error);
    }
}
const getAllRoutes = async (request, response)=> {
    try {
       const allRoutes = await Route.find();
       response.status(200).send(allRoutes);
    } catch(error) {
      response.status(400).send("Error in getAllRoutes: "+error.message);
    }
}
const getRouteById = async (request, response)=> {
  try {
    const routeId = request.params.id;
    if(! routeId) {
      throw new Error("Rotue id is missing...!!!");
    }
     const route = await Route.findById(routeId);
     if(! route) {
      throw new Error("Route does not exist...!!!");
     }
     response.status(200).send({message: "Route found successfully", route: route});
  } catch(error) {
    response.status(404).send("Error in getRouteById: " + error.message);
  }
}
const updateRouteById = async (request, response)=> {
     try{
        const routeId = request.params.id;
        if(! routeId) {
          throw new Error("Route Id is missing...!!!");
        }
        const route = await Route.findById(routeId);
        if(! route) {
          throw new Error("Route does not exist...!!!");
        }
        const {source, destination, stops, fare} = request.body;
        if(source) {
          route.source = source;
        }
        if(fare) {
          route.fare = fare;
        }
        if(destination) {
          route.destination = destination;
        }
        if(stops) {
          route.stops = stops;
        }
        await route.save();
        response.status(200).send("Route updated successfully...!!!");
     } catch(error) {
      response.status(400).send("Error in updateRouteById: "+error.message);
     }
}
const deleteRouteById = async (request, response)=> {
     try{
        const routeId = request.params.id;
        if(! routeId) {
          throw new Error("Route Id is missing...!!!");
        }
        const route = await Route.findByIdAndDelete(routeId);
        if(! route) {
          throw new Error("Route does not exist...!!!");
        }
        response.status(200).send("Route deleted successfully...!!!");
     } catch(error) {
      response.status(400).send("Error in deleteRouteById: "+error.message);
     }
}
module.exports = {addRoute, getAllRoutes, getRouteById, updateRouteById, deleteRouteById};