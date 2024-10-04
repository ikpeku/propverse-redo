const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const ResetPassword = require("../../model/passwordReset");
// resend email
const ValidationUser = require("../../model/verifyUser");
const { sendSignUpVerifyEmail } = require("../../middleware/sendMail");
const { errorHandler } = require("../../utils/error");

const Due_deligence = require("../../model/developer/due_deligence");

const authToken  = require("../../middleware/refreshToken");

require("dotenv").config();

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req?.body;

  const authTokenInit = new authToken();
  

  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }
  
    const user = await User.findOne({email});
   

    if (!user) {
      return next(errorHandler(401, "User not found"));
    } 

    if(user.account_type === "Admin"){
      return next(errorHandler(401, "forbidden"));
    }
    
    // check of a verify user

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      
      return next(errorHandler(401, "Invalid credential"));

    } else {
      // if (!user.verify_account) {
      //   await ValidationUser.deleteMany({ userId: user._id.toString() });
      //   await sendSignUpVerifyEmail(user, res, next, (islogin = true));
      // } else {
        const token = await authTokenInit.createToken(user);

        delete user["_doc"].password;
        await ResetPassword.deleteMany({ userId: user._id })



        let developer;
        if(user?.account_type === "Developer"){
          developer = await Due_deligence.findById(user._id).select("isAdminAproved isSubmited")
        }

        res
          .status(200)
          .json({
            message: "Login you successful",
            data:  user?.account_type === "Developer" ? {...user?._doc, ...developer?._doc} : user,
            token: token.token,
            expiresIn: token.expiredAt,
          });
      // }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
