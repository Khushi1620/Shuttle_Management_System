const redisClient = require("../config/redis");
const User = require("../models/user");
const validateUser = require("../utils/validateUsers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (request, response) => {
  try {
    validateUser(request.body);
    const { firstName, emailId, password } = request.body;
    request.body.password = await bcrypt.hash(password, 10);
    request.body.role = "user";
    request.body.walletBalance = 0;
    const user = await User.create(request.body);
    const token = jwt.sign(
      { _id: user.id, emailId: emailId, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    response.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    response.status(201).send("User resgistered successfully...!!!");
  } catch (error) {
    response.status(400).send("Error is: " + error);
  }
};
const login = async (request, response) => {
  try {
    const { emailId, password } = request.body;
    if (!emailId) {
      throw new Error("Invalid credentials...!!!");
    }
    if (!password) {
      throw new Error("Invalid credentials...!!!");
    }
    const loginUser = await User.findOne({ emailId });
    if (!loginUser) {
      throw new Error("Invalid credentials...!!!");
    }
    const pass = await bcrypt.compare(password, loginUser.password);
    if (!pass) {
      throw new Error("Invalid credentials...!!!");
    }
    const token = jwt.sign(
      { _id: loginUser.id, emailId: loginUser.emailId, role: loginUser.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    if (loginUser.role === "admin") {
      response.cookie("adminToken", token, { maxAge: 60 * 60 * 1000 });
    } else {
      response.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    }

    response.status(201).send("Logged in successfuly...!!!");
  } catch (error) {
    response.status(400).send("Error is: " + error);
  }
};
const logout = async (request, response) => {
  try {
    const token = request.cookies.token || request.cookies.adminToken;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    response.cookie("token", null, { expires: new Date(Date.now()) });
    response.send("Logged out successfully...!!!");
  } catch (error) {
    response.status(503).send("Error is: " + error);
  }
};
const getProfile = async (request, response) => {
  try {
    const token = request.cookies.token || request.cookies.adminToken;
    if(! token) {
      throw new Error("Missing required field...!!!");
    }
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(payload._id);
    if(! user) {
      throw new Error("User does not exist...!!!");
    }
    response.status(200).send(user);
  } catch (error) {
    response.status(400).send("Error id: " + error.message);
  }
};
const forgotPassword = async (request, response) => {
  try {
    const {emailId} = request.body;
    if(! emailId) {
      throw new Error("Required field missing...!!!");
    }
    const user = await User.findOne({emailId});
    if(! user) {
      throw new Error("User not found...!!!");
    }
    const resetToken = jwt.sign({_id: user._id, emailId: user.emailId}, process.env.JWT_KEY, {expiresIn: 60*10});
    response.status(200).send({message: "Reset token generated", token: resetToken});
  } catch (error) {
    response.status(400).send("Error is: " + error);
  }
};
const resetPassword = async (request, response) => {
  try {
    const {token, newPassword} = request.body;
    if(! token) {
      throw new Error("Required field missing...!!!");
    }
    if(! newPassword) {
      throw new Error("Required field missing...!!!");
    }
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(payload._id);
    if(! user) {
      throw new Error("User does not exist...!!!");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    response.status(200).send("Password reset successfully...!!!");
  } catch (error) {
    response.status(400).send("Error is: " + error);
  }
};
const updateProfile = async (request, response) => {
  try {
    const token = request.cookies.token || request.cookies.adminToken;
    if(! token) {
      throw new Error("Token is not present...!!!");
    }
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(payload._id);
    if(! user) {
      throw new Error("User does not exist...!!!");
    }
    const {firstName, lastName, age, gender} = request.body;
    if(firstName) {
      user.firstName = firstName;
    }
    if(lastName) {
      user.lastName = lastName;
    }
    if(age) {
      user.age = age;
    }
    if(gender) {
      user.gender = gender;
    }
    await user.save();
    response.status(200).send("Profile updated successfully...!!!");
  } catch (error) {
    response.status(400).send("Error is: "+ error.message);
  }
};
const userRechargeWallet = async(request, response)=> {
  try {
     const userId = request.user.id;
     if(! userId) {
      throw new Error("Required field missing...!!!");
     }
     const {amount} = request.body;
     if(! amount || amount <= 0) {
      throw new Error("Invalid amount...!!!");
     }
     const user = await User.findById(userId);
     user.walletBalance = user.walletBalance + amount;
     await user.save();
     response.status(200).send("Wallet recharged successfully...!!!");
  } catch(error) {
    response.status(400).send("Error in rechargeWallet: "+error.message);
  }
}
module.exports = {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  updateProfile,
  userRechargeWallet,
};
