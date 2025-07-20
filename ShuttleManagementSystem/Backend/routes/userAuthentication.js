const express = require('express');
const authRouter = express.Router();
const {register, login, logout, getProfile, forgotPassword, resetPassword, updateProfile,  userRechargeWallet} = require('../controllers/userAuthenticationFunctions');
const userMiddleware = require('../middleware/userMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.get('/getProfile', getProfile);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/resetPassword', resetPassword);
authRouter.patch('/updateProfile', updateProfile);
authRouter.post('/recharge', userMiddleware, userRechargeWallet);

module.exports = authRouter;