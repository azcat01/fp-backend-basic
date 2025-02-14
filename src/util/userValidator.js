const { checkSchema } = require('express-validator')          
const { User } = require("../model");            

const createAccountValidator = checkSchema({
  username: {
    notEmpty: {
      errorMessage: "Please fill in the username!",
      bail: true
    },
    isLength: { 
      options: { min: 4 },
      errorMessage: "Username should be at least 4 characters!",
      bail: true
    },
    isAlphanumeric: {
      errorMessage: "Username should not contains any symbols!",
      bail: true
    },
    custom: { 
      options: async username => {
        const exist = await User.findOne({ username });
        if(exist) {
          throw new Error ("Username already exists!");
        }
      }
    }
  },
  email: {
    notEmpty: {
      errorMessage: "Please fill in the email!",
      bail: true
    },
    isEmail: true,
    errorMessage: "Invalid email format!",
    custom: { 
      options: async email => {
        const exist = await User.findOne({ email });
        if(exist) {
          throw new Error ("Email already exists!");
        }
      }
    }
  },
  password: {
    notEmpty: {
      errorMessage: "Please fill in the password!",
      bail: true
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
      },
      errorMessage: "Password should be at least 6 characters and contains at least an uppercase, lowercase, and number!"
    },
  }
})

const loginValidator = checkSchema({
  username: {
    notEmpty: {
      errorMessage: "Please fill in the username!",
      bail: true
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Please fill in the password!",
      bail: true
    }, 
  }
})

module.exports = {
  createAccountValidator,
  loginValidator
}