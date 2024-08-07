const User = require("../../model/user");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
// resend email
const ValidationUser = require("../../model/verifyUser");
const { sendSignUpVerifyEmail, loginAdminMail } = require("../../middleware/sendMail");
const { errorHandler } = require("../../utils/error");
const authToken = require("../../middleware/refreshToken");

require("dotenv").config();

exports.AdminLogin = async (req, res, next) => {
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

    if(user.account_type !== "Admin"){
      return next(errorHandler(401, "forbidden"));
    }
    
    // check of a verify user

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      
      return next(errorHandler(401, "Invalid credential"));

    } else {
      if (!user.verify_account) {
        await ValidationUser.deleteMany({ userId: user._id.toString() });
        await sendSignUpVerifyEmail(user, res, next, (islogin = true));
      } else {


      //  await loginAdminMail(user, res, next)

       const token = await authTokenInit.createToken(user);

        // delete user["_doc"].password;
        // await LoginAdminValidateToken.deleteMany({ userId: user._id })

        const adminInfo = {
            _id: user._id,
        avatar: user.avatar,
        email: user.email,
        username: user.username,
        country: user.country,
        phone_number: user.phone_number
        }

        res
          .status(200)
          .json({
            message: "Login you successful",
            data: adminInfo,
            token: token.token,
            expiresIn: token.expiredAt,
          });

      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
