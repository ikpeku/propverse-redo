const { validationResult } = require("express-validator");
const User = require("../../model/user");
const { sendForgetPasswordMail } = require("../../middleware/sendMail");

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    const userResponse = await User.findOne({ email });

    if (!userResponse) {
      const error = new Error("A user with this name could not be found");
      error.statusCode = 401;
      throw error;
    }

    if (!userResponse.verify_account) {
      const error = new Error(
        "User email not verify yet. Check your inbox to continue"
      );
      error.statusCode = 401;
      throw error;
    } else {

      sendForgetPasswordMail(userResponse, res, next);
    }
  } catch (error) {
    next(error);
  }
};
