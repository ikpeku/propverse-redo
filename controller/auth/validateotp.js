const User = require("../../model/user");
const ResetPassword = require("../../model/passwordReset");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../../utils/error");

exports.validateotp = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const userResponse = await ResetPassword.findOne({ resetString: otp });

    // return res.status(200).json({
    //   message: "Password has been reset successfully.",
    //   status: "success",
    //   data: {
    //     userResponse,
    //     otp,
    //   },
    // });

    if (!userResponse)  {
      return next(errorHandler(401, "invalid otp"))
    }

    if (userResponse.expiresAt < Date.now()) {
        await ResetPassword.deleteOne({ resetString: otp })

        return res.status(200).json({
            message: "otp expired. Please reset again",
            status: "Pending",
        })

    } else {
        
        return res.status(200).json({
            message: "Password has been reset successfully.",
            status: "success",
            data: {
                userId: userResponse.userId,
            },
        })

    }
  } catch (error) {
    next(error);
  }
};
