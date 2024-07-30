const { validationResult } = require("express-validator");
const ValidationUser = require("../../model/verifyUser");
const User = require("../../model/user");

const { sendSignUpVerifyEmail } = require("../../middleware/sendMail");
const { errorHandler } = require("../../utils/error");

exports.resignup = async (req, res, next) => {

    const { userId, email } = req.body

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

        const userResponse = await User.findOne({ email })


        if (!userResponse) {

            return next(errorHandler(401, "Account record does not exist or has been verify already please signup or login to continue with propverse."))
            // const error = new Error(');
            // error.statusCode = 401
            // throw error
        }

        const response = await ValidationUser.findOne({ userId })


        if (!response) {
            return next(errorHandler(401, "Account record does not exist or has been verify already please signup or login to continue with propverse."))

        }


        await ValidationUser.deleteOne({ userId })

        await sendSignUpVerifyEmail(userResponse, res, next, islogin = true)


    } catch (error) {
        next(error)
    }


}