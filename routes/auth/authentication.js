const express = require("express");
const { signUpUser , signUpAdmin} = require("../../controller/auth/signup");
const { resignup } = require("../../controller/auth/resignup");

const { loginUser } = require("../../controller/auth/login");
const { verifyUser } = require("../../controller/auth/verify");
const { resetPassword } = require("../../controller/auth/resetPassword");
const { forgetPassword } = require("../../controller/auth/forgetPassword");
const { changePassword } = require("../../controller/auth/changePassword");
const resendForgetPassword = require("../../controller/auth/resendForgetPassword");

const {
  registrationValidator,
  loginValidator,
  verifyuserValidator,
  resetPassWordValidator,
  forgetPassWordValidator,
  resendForgetPassWordValidator,
  changePassWordValidator,
  developerRegistrationValidator,
  googleRegistrationValidator,
} = require("../../validation/user");
// const { signUpAdmin, signUpUser } = require("../../controller/auth/signup");

const route = express.Router();
// const jwt = require('jsonwebtoken');
const { googleAuth } = require("../../controller/auth/oauth");
const { tokenValidate } = require("../../controller/auth/refreshToken");
const { validateotp } = require("../../controller/auth/validateotp");



// signup a admin
route.post(
  "/admin-signup",
  signUpAdmin
);

// signup a Non Institutional Investor
route.post(
  "/signup",
  (req, res, next) => {
    (req.body.account_type = "Non Institutional Investor"),
    // (req.body.status = "Investor"),
    next();
  },
  registrationValidator,
  signUpUser
);

// signup a developer
route.post(
  "/developer/signup",
  (req, res, next) => {
    (req.body.account_type = "Project manager"),
    // (req.body.status = "Developer");
    next();
  },
  developerRegistrationValidator,
  signUpUser

);

// signup a Institutional Investor
route.post(
  "/institutional/signup",
  (req, res, next) => {
    (req.body.account_type = "Institutional Investor"),
    // (req.body.status = "Investor");
    next();
  },
  developerRegistrationValidator,
  signUpUser
);

// signup a user
route.post("/resignup", resendForgetPassWordValidator, resignup);

// login a user
route.post("/login", 
loginValidator, 
loginUser);

// verify user
route.patch("/verify", verifyuserValidator, verifyUser);

// reset password
route.post("/resetPasswordRequest", resetPassWordValidator, resetPassword);

// change password
route.post(
  "/changePasswordRequest/:userId",
  changePassWordValidator,
  changePassWordValidator
);

// forget password
route.post("/forgetPasswordRequest", forgetPassWordValidator, forgetPassWordValidator);

// forget password
route.post(
  "/resendForgetPasswordRequest",
  resendForgetPassWordValidator,
  resendForgetPassWordValidator
);

route.post("/google", googleRegistrationValidator, googleAuth);

route.get("/signout", (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User successfully logout.");
  } catch (error) {
    next(error);
  }
});

route.post("/token-validate",tokenValidate
);

route.post("/otp-validate",validateotp
);



// router.use((req, res, next) => {
//   const token = yourJwtService.getToken(req) // Get your token from the request
//   jwt.verify(token, 'your-secret', function(err, decoded) {
//     if (err) throw new Error(err) // Manage different errors here (Expired, untrusted...)
//     req.auth = decoded // If no error, token info is returned in 'decoded'
//     next()
//   });
// })

module.exports = route;
