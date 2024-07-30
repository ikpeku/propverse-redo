const { validationResult } = require("express-validator");
const User = require("../../model/user");
const { sendForgetPasswordMail } = require("../../middleware/sendMail");
const ResetPassword = require("../../model/passwordReset");


module.exports = async (req, res, next) => {
    const errors = validationResult(req);

    const { userId, email } = req.body

    try {

        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map((error) => error.msg);

            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: validationErrors,
            });
        }


        await ResetPassword.deleteMany({ userId })
        const userResponse = await User.findOne({ email })
        sendForgetPasswordMail(userResponse, res, next)

    } catch (error) {
        next(error)
    }

}