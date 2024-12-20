const { validationResult } = require("express-validator");
const ValidationUser = require("../../model/verifyUser");
const User = require("../../model/user");
const Developer_Due_Diligence = require("../../model/developer/due_deligence")
const Non_Institutional_Investment = require("../../model/non_institional/non_institutional")
// const Institutional_Investor = require("../../model/institutional/fund_manger");

const Kyc = require("../../model/compliance/kyc")
const Acreditation = require("../../model/compliance/accreditation")


const bcrypt = require("bcryptjs");
const { sendSignUpVerifyEmail } = require("../../middleware/sendMail");

// const jwt = require("jsonwebtoken");
const { errorHandler } = require("../../utils/error");

const authToken = require("../../middleware/refreshToken");

require("dotenv").config();

exports.verifyUser = async (req, res, next) => {
  const { userId, token: uniqueString, refId } = req.body;

  const errors = validationResult(req);
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
    // const maxAge = 1000 * 60 * 60 * 24 * 7;

    const response = await ValidationUser.findOne({ userId });

    if (!response) {
      return next(
        errorHandler(
          401,
          "Account record does not exist or has been verify already please signup or login to continue with propverse."
        )
      );
    }

    const { expiresAt, uniqueString: hashedUniqueString } = response;
    const data = await User.findOne({ _id: userId }).select("-password");

    if (expiresAt < Date.now()) {
      await ValidationUser.deleteOne({ userId });

      await sendSignUpVerifyEmail(data, res, next, (islogin = true));
    } else {
      // check the hash key

      const hashResult = bcrypt.compare(uniqueString, hashedUniqueString);

      if (hashResult) {
        // update user verify to true
        await User.updateOne({ _id: userId }, { verify_account: true });

        // delete user verification record
        await ValidationUser.deleteOne({ userId });


        if(data.account_type === "Developer") {
          await Developer_Due_Diligence.create({_id: userId, user: userId})
        }


        if(data.account_type === "Non-Institutional Investor") {
         
          await Non_Institutional_Investment.create({_id: userId, user: userId, kyc:userId, accreditation:userId});
        }

        if(data.account_type === "Non-Institutional Investor" || data.account_type === "Institutional Investor") {
          await Kyc.create({_id: userId, user: userId});
          await Acreditation.create({_id: userId, user: userId});

         }

        //  if(data.account_type === "Institutional Investor"){
        //      await  Institutional_Investor.create({_id:userId, user: userId, kyc: userId, accreditation: userId })
        //  }


        const token = await authTokenInit.createToken(data);

        return (
          res
            .status(200)
            .json({
              success: true,
              message: "user is verify successfully",
              data,
              token: token.token,
              expiresIn: token.expiredAt,
            })
        );
      } else {
        return next(
          errorHandler(
            500,
            "invalid credentail details passed. please check mail."
          )
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
