const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const userMiddleware = async(request, response, next)=> {
    try {
        const token = request.cookies.token;
        if(! token) {
            throw new Error("Token is not present...!!!");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
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
        request.user = result;
        next();
    } catch(error) {
        response.send("Error is: "+error);
    }
}
module.exports = userMiddleware;