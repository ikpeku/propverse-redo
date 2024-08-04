
const LoginAdminValidateToken = require("../../model/loginAdmin");

// exports.verifyAdminLoginToken = async (req, res, next) => {
//   const { token } = req.body;

//   try {

//    const response = await LoginAdminValidateTokeen.find({userId: token})



//   } catch (error) {}
// };



const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const ResetPassword = require("../../model/passwordReset");
// resend email
const ValidationUser = require("../../model/verifyUser");
const { sendSignUpVerifyEmail } = require("../../middleware/sendMail");
const { errorHandler } = require("../../utils/error");

const authToken  = require("../../middleware/refreshToken");

require("dotenv").config();

exports.verifyAdminLoginToken = async (req, res, next) => {

  const { token} = req?.body;

  const authTokenInit = new authToken();
  

  try {


    const response = await LoginAdminValidateToken.findOne({loginString: token})


    if(!response){
        return next(errorHandler(401, "invalid or expired token"));
      }

  
    const user = await User.findById(response.userId);
   

    if (!user) {
      return next(errorHandler(401, "Adnin data not found"));
    } 

    if(user.account_type !== "Admin"){
      return next(errorHandler(401, "forbidden"));
    }
    
   
      if (!user.verify_account) {
        await ValidationUser.deleteMany({ userId: user._id.toString() });
        await sendSignUpVerifyEmail(user, res, next, (islogin = true));
      } else {
        const token = await authTokenInit.createToken(user);

        // delete user["_doc"].password;
        await LoginAdminValidateToken.deleteMany({ userId: user._id })

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
  
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

