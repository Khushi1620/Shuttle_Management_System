const Shuttle = require('../models/shuttle');

const addShuttle = async (request, response)=> {
    try {
     const {busNumber, capacity, routeId, driverName, currentStatus} = request.body;
     if(! busNumber || ! capacity || ! routeId || ! driverName) {
        throw new Error("Required field missing...!!!");
     }
     const exist = await Shuttle.findOne({busNumber});
     if(exist) {
        throw new Error("Bus number already registered...!!!");
     }
     const createShuttle = await Shuttle.create({busNumber, capacity, routeId, driverName, currentStatus});
     response.status(201).send({message: "Shuttle added successfully", data: createShuttle});
    } catch(error) {
        response.status(400).send("Error is in addShuttle: " + error.message);
    }
}
const getAllShuttles = async (request, response)=> {
    try{
 const allShuttles = await Shuttle.find().populate('routeId', 'source destination');
    response.status(200).send(allShuttles);
    } catch(error) {
        response.status(400).send("Error is: "+ error.message);
    }
}
const getShuttleById = async (request, response)=> {
    try {
  const { id } = request.params;
    if (!id) {
      throw new Error("Id is missing...!!!");
    }

    const shuttle = await Shuttle.findById(id).populate('routeId', 'source destination');
    if (!shuttle) {
      throw new Error("Shuttle not found...!!!");
    }

    response.status(200).send({message: "Shuttle found successfully...!!!", shuttle: shuttle});
    } catch(error) {
        response.status(400).send("Error is: " + error.message);
    }
}
const updateShuttle = async (request, response)=> {
    try {
       const id = request.params.id;
       if(! id) {
        throw new Error("Id is missing...!!!");
       }
       const {routeId, driverName} = request.body;
       const shuttle = await Shuttle.findById(id);
       if(! shuttle) {
        throw new Error("Shuttle is not present...!!!");
       }
       if(routeId) {
        shuttle.routeId = routeId;
       }
       if(driverName) {
        shuttle.driverName = driverName;
       }
       await shuttle.save();
       response.status(200).send("Shuttle updated successfully...!!!");
    } catch(error) {
        response.status(400).send("Error is: "+ error.message);
    }
}
const deleteShuttle = async (request, response)=> {
    try{
    const id = request.params.id;
    if(! id) {
        throw new Error("Id is not present...!!!");
    }
    const shuttle = await Shuttle.findByIdAndDelete(id);
    if(! shuttle) {
        throw new Error("Shuttle not present...!!!");
    }
    response.status(200).send("Shuttle deleted successfully...!!!");
    } catch(error){
        response.status(400).send("Error is: "+error.message);
    }
}
const updateStatus = async (request, response)=> {
    try {
       const id = request.params.id;
       if(! id) {
        throw new Error("Id is not present...!!!");
       }
       const {currentStatus} = request.body;
       if(! currentStatus) {
        throw new Error("Status is not present...!!!");
       }
       const shuttle = await Shuttle.findById(id);
       if(! shuttle) {
        throw new Error("Shuttle not found...!!!");
       }
       shuttle.currentStatus = currentStatus;
       await shuttle.save();
       response.status(200).send("Shuttle status updated successfully...!!!");
    } catch(error) {
        response.status(400).send("Error is: "+error.message);
    }
}

module.exports = {addShuttle, getAllShuttles, getShuttleById, updateShuttle, deleteShuttle, updateStatus};