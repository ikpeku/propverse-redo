const { validationResult } = require("express-validator");
const ValidationUser = require("../../model/verifyUser");
const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const { sendSignUpVerifyEmail } = require("../../middleware/sendMail");

const jwt = require("jsonwebtoken");
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

        const findReferral = await Referral.find({ userId: data._id })
          .where("referralId")
          .equals(refId)
          .exec();

        if (findReferral) {
          if (refId) {
            const refdata = await User.findOne({ verify_account: true })
              .where("referral.referralId")
              .equals(refId)
              .exec();

            if (refdata) {
              refdata.referral.award += 10;
              refdata.referral.number_of_referral += 1;

              refdata.save();

              await Referral.deleteMany({
                userId: data._id,
                referralId: refId,
              });
            }
          }
        }

        const token = await authTokenInit.createToken(data);

        

        return (
          res
            // .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
            .status(200)
            .json({
              success: true,
              message: "user is verify successfully",
              // data: userData,
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
