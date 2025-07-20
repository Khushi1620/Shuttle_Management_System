const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async(request, response, next)=> {
    try {
        const token = request.cookies.adminToken;
        if(! token) {
            throw new Error("Token is not present...!!!");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
        if(payload.role != 'admin') {
            throw new Error("Invalid admin...!!!");
        }
        const {_id} = payload;
        if(! _id) {
            throw new Error("Id is not present...!!!");
        }
        const result = await User.findById(_id);
        if(! result) {
            throw new Error("User does not exist...!!!");
        }
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked) {
            throw new Error("Invalid token...!!!");
        }
        request.result = result;
        next();
    } catch(error) {
        response.status(403).send("Error is: "+error);
    }
}
module.exports = adminMiddleware;