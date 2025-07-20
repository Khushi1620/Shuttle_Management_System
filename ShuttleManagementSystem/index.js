const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./Backend/config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./Backend/routes/userAuthentication');
const shuttleRouter = require('./Backend/routes/ShuttleFunctionalities');
const routeRouter = require('./Backend/routes/routeFunctionalities');
const bookingRouter = require('./Backend/routes/bookingFunctionalities');
const adminRouter = require('./Backend/routes/adminFunctionalities');
const redisClient = require('./Backend/config/redis'); 

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);
app.use('/shuttle', shuttleRouter);
app.use('/route', routeRouter);
app.use('/booking', bookingRouter);
app.use('/admin', adminRouter);

const InitializeConnection = async()=> {
    try{
        await Promise.all([main(), redisClient.connect()]);
        console.log("Redis database connected...!!!");
        app.listen(process.env.PORT, ()=> {
        console.log("Server is listening at PORT number: " + process.env.PORT);
    })
    } catch(error) {
      console.log("Error is: "+error.message);
    }
}
InitializeConnection();