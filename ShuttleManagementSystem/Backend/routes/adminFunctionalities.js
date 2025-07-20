const express = require('express');
const adminRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {register,login, getProfile, forgotPassword, resetPassword, updateProfile} = require('../controllers/userAuthenticationFunctions');
const {adminRegister, adminRechargeWallet, getAllUsers, adminLogout} = require('../controllers/adminFunctionalitiesImplement');

adminRouter.post('/registerAdmin', adminMiddleware, adminRegister);
adminRouter.post('/registerUser', adminMiddleware, register);
adminRouter.post('/recharge', adminMiddleware, adminRechargeWallet);
adminRouter.get('/getAllUsers', adminMiddleware, getAllUsers);
adminRouter.post('/login', login);
adminRouter.post('/logout', adminMiddleware, adminLogout);
adminRouter.get('/getProfile', getProfile);
adminRouter.post('/forgotPassword', forgotPassword);
adminRouter.post('/resetPassword', resetPassword);
adminRouter.patch('/updateProfile', updateProfile);

module.exports = adminRouter;
