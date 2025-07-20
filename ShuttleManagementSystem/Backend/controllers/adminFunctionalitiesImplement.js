const User = require("../models/user");
const validateUser = require("../utils/validateUsers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const adminRegister = async (request, response) => {
  try {
    validateUser(request.body);
    const { emailId, password } = request.body;
    request.body.password = await bcrypt.hash(password, 10);
    const user = await User.create(request.body);
    request.body.walletBalance = undefined;
    request.body.role = "admin";
    const token = jwt.sign(
      { _id: user.id, emailId: emailId, role: "admin" },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    response.cookie("adminToken", token, { maxAge: 60 * 60 * 1000 });
    response.status(201).send("Admin registered successfully...!!!");
  } catch (error) {
    response.status(400).send("Error is: " + error);
  }
};
const adminRechargeWallet = async (request, response) => {
  try {
    const { userId, amount } = request.body;
    if (!userId || !amount || amount <= 0) throw new Error("Invalid input!");
    const user = await User.findById(userId);
    user.walletBalance += amount;
    await user.save();
    response.status(200).send("Points assigned successfully.");
  } catch (error) {
    response.status(400).send("Error is: " + error.message);
  }
};
const getAllUsers = async (request, response)=> {
  try {
    const users = await User.find({ role: 'user' });
    response.status(200).send(users);
  } catch(error){
    response.status(400).send("Error in getAllUsers: "+ error.message);
  }
}
const adminLogout = async (request, response) => {
  try {
    const token = request.cookies.token || request.cookies.adminToken;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    response.cookie("adminToken", null, { expires: new Date(Date.now()) });
    response.send("Logged out successfully...!!!");
  } catch (error) {
    response.status(503).send("Error is: " + error);
  }
};
module.exports = {
  adminRegister,
  adminRechargeWallet,
  getAllUsers,
  adminLogout
};
