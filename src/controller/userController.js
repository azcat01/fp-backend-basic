const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { User, Image, ImageData } = require("../model");
const { createUserToken } = require('../util/token');
const jwt = require("jsonwebtoken");

const getNavbarInfo = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (token) {
      jwt.verify(token, process.env.USER_TOKEN_KEY, async (err, data) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(200).json({
              status: "OK",
              message: "Success"
            })
          }
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          })
        }

        let user = await User.findById(data.id).select("username img_id");
        user = user?.toObject();

        let img = await Image.findOne({ files_id : user.img_id.slice(-1)[0] }).select("data");
        img = img?.toObject();
        const imgInfo = await ImageData.findById(user.img_id.slice(-1)[0]);

        return res.status(200).json({
          status: "OK",
          user: user.username,
          img: {
            data: img?.data || "",
            metadata: imgInfo || ""
          }
        });
      });
    } else {
      return res.status(200).json({
        status: "OK",
        message: "Success"
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString(),
    });
  }
}

const invalidPage = async (req, res, next) => {
  return res.status(404).json({
    status: "Not Found",
    message: "404 Not Found, you shouldn't be here!"
  })
}

const createAccount = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const errorResult = validationResult(req).formatWith(error => {
      if (error.path === "password") {
        error.value = ""
      }
    });
    errorResult.array();
    
    if (errorResult.isEmpty()) {
      const userAccount = {
        username,
        email,
        password: await bcrypt.hash(req.body.password, 10),
        createdAt: new Date().toISOString()
      };

      const account = await User.create(userAccount);
      const token = createUserToken(account._id);
      
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
        message: errorResult,
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
    const { username, password } = req.body;
    const errorResult = validationResult(req).formatWith(error => {
      if (error.path === "password") {
        error.value = ""
      }
    });
    errorResult.array();

    let account = await User.findOne({ username })
    account = account?.toObject();
    
    if (errorResult.isEmpty() && account !== undefined) {

      const verify = await bcrypt.compare(password, account.password);
      
      if(verify) {
        const token = createUserToken(account._id)
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
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
};

const logoutAccount = async(req, res, next) => {
  try {
    const token = req.cookies.token

    if (token) {
      jwt.verify(token, process.env.USER_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          })
        }

        return res.status(200).clearCookie("token").json({
          status: "OK",
          message: "Success"
        })
        }
      )
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
}

const getAccount = async(req, res, next) => {
  try {
    const token = req.cookies.token

    if(token) {
      jwt.verify(token, process.env.USER_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          })
        }

        const username = req.params.username
        let account = await User.findById(data.id).select("-password")
        account = account?.toObject();

        if (!account) {
          return res.status(404).json({
            status: "Not Found",
            message: "Account not found!"
          });
        }
        
        if (username !== account.username) {
          return res.status(403).json({
            status: "Forbidden",
            message: "Wrong Account!"
          })
        }

        let img = await Image.findOne({ files_id : account.img_id.slice(-1)[0] }).select("data");
        img = img?.toObject();
        const imgInfo = await ImageData.findById(account.img_id.slice(-1)[0]);
        

        return res.status(200).json({
          status: "OK",
          message: "Success!",
          data: account,
          img: {
            data: img?.data || "",
            metadata: imgInfo || ""
          }
        });
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      })
    }

  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString()
    });
  }
}

const editAccount = async(req, res, next) => {
  try {
    const { 
      fullName,
      gender,
      birthDate,
      job,
      organization,
      phoneNumber,
      email,
     } = req.body

     const token = req.cookies.token

     if (token) {
      jwt.verify(token, process.env.USER_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          })
        }

        const username = req.params.username;
        let account = await User.findById(data.id);
        account = account?.toObject();
        
        if (username !== account.username) {
          return res.status(403).json({
            status: "Forbidden",
            message: "Wrong Account!"
          })
        }

        const modifiedUserDoc = await User.findByIdAndUpdate(account._id,
          {
            bio: {
              full_name: fullName || account.bio?.full_name || "",
              gender: gender || account.bio?.gender || "",
              birth_date: birthDate? new Date(birthDate) : account.bio?.birth_date || "",
              job: job || account.bio?.job || "",
              organization: organization || account.bio?.organization || "",
              phone_number: phoneNumber || account.bio?.phone_number || "",
            },
            email: email || account.email,
            $addToSet: {
              img_id: req.file?.id || account.img_id || "" 
            },
            updated_at: new Date(),
          }, {
            new: true,
            strict: false
          })
          .select("-password");

        return res.status(200).json({
          status: "OK",
          message: "Account has been updated!",
          data: modifiedUserDoc
        });
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      })
    }

  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString(),
    });
  }
}

const deleteAccount = async (req, res, next) => {
  try {
    const token = req.cookies.token
    
    if (token) {
      jwt.verify(token, process.env.USER_TOKEN_KEY, async (err, data) => {
        if (err) {
          return res.status(401).json({
            status: "Unauthorized",
            data: err,
            message: "Please login!"
          })
        }

        const username = req.params.username
        let account = await User.findById(data.id);
        account = account.toObject();

        if (!account) {
          return res.status(404).json({
            status: "Not Found",
            message: "Account not found!",
          });
        }
        
        if (username !== account.username) {
          return res.status(403).json({
            status: "Forbidden",
            message: "Wrong Account!"
          })
        }
        
        const img = await Image.deleteMany({ files_id : { $in: account.img_id } });
        await ImageData.deleteMany({ _id: { $in: account.img_id } });
        
        const result = await User.findByIdAndDelete(account._id);

        return res.status(200).clearCookie("token").json({
          status: "OK",
          message: "Account has been deleted!",
          data: {
            username: result.username,
            img: img
          }
        });
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please login!"
      })
    }

  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.toString(),
    });
  }
};

module.exports = {
  getNavbarInfo,
  invalidPage,
  createAccount,
  loginAccount,
  logoutAccount,
  getAccount,
  editAccount,
  deleteAccount
}