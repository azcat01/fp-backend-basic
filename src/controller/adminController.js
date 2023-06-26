const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { Admin, User } = require("../model");
const { createAdminToken } = require('../util/token');
const jwt = require("jsonwebtoken");

const createAccount = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errorResult = validationResult(req).formatWith(error => {
      if (error.path === "password") {
        error.value = "";
      }
    });
    errorResult.array();

    const accountExists = await Admin.findOne({ email });
    
    if (errorResult.isEmpty() && !accountExists) {
      const adminAccount = {
        email,
        password: await bcrypt.hash(req.body.password, 10),
        createdAt: new Date().toISOString()
      };

      const account = await Admin.create(adminAccount);
      const token = createAdminToken(account._id);
      
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      
      return res.status(201).json({
        status: "Created",
        message: "Account successfully created",
      });
    } else {
      return res.status(400).json({
        status: "Bad Request",
        message: errorResult.isEmpty()? "Account already exists!" : errorResult,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString(),
    });
  }
};

const loginAccount = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errorResult = validationResult(req).formatWith(error => {
      if (error.path === "password") {
        error.value = "";
      }
    });
    errorResult.array();

    let account = await Admin.findOne({ email });
    account = account?.toObject();
    
    if (errorResult.isEmpty() && account !== undefined) {
      const verify = await bcrypt.compare(password, account.password);
      
      if(verify) {
        const token = createAdminToken(account._id)
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
        });

        return res.status(201).json({
          status: "OK",
          message: "Success",
        });
      } else {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Incorrect username or password!"
        });
      }
    } else {
      return res.status(400).json({
        status: "Bad Request",
        message: errorResult.isEmpty() ? "Incorrect username or password" : errorResult
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
};

const logoutAccount = async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.ADMIN_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          });
        }

        return res.status(200).clearCookie("token").json({
          status: "OK",
          message: "Success"
        });
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
}

const deleteAccount = async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.ADMIN_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          });
        }

        const id = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).id;0
        const result = await Admin.findByIdAndDelete(id).select("-password");

        return res.status(200).clearCookie("token").json({
          status: "OK",
          message: "Account has been deleted!",
          result: result
        });
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
}

const getUserAccount = async(req, res, next) => {
  try {
    const token = req.cookies.token
    if (token) {
      jwt.verify(token, process.env.ADMIN_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          });
        }

        const { username, email } = req.body;
        
        const result = await User.find({ $or: [{username: {$regex: username}}, {email: email}] }).select("-password"); 

        return res.status(200).json({
          status: "OK",
          message: "Success",
          result: result
        });
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
}

module.exports = {
  createAccount,
  loginAccount,
  logoutAccount,
  deleteAccount,
  getUserAccount,
};