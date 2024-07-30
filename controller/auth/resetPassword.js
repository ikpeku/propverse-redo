const { validationResult } = require("express-validator");
const User = require("../../model/user");
const ResetPassword = require("../../model/passwordReset");
const bcrypt = require("bcryptjs");

exports.resetPassword = async (req, res, next) => {
    const { userId, token: resetString , otp, newPassword } = req.body

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

        const userResponse = await ResetPassword.findOne({ userId })
        if (!userResponse) {
            const error = new Error('A user with this name could not be found');
            error.statusCode = 401
            throw error
        }


        if (userResponse.expiresAt < Date.now()) {
            await ResetPassword.deleteOne({ userId })


            return res.status(200).json({
                message: `Reset password ${resetString ? "link" : "otp" } expired. Please reset again`,
                status: "Pending",
                data: {
                    id: userResponse._id.toString(),
                },
            })

        } else {
            const hashString = bcrypt.compare(resetString ? resetString : otp , userResponse.resetString)

            if (!hashString) {
                const error = new Error('Invalid reset details pass.');
                error.statusCode = 401
                throw error
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12)
            if (!hashedPassword) {
                const error = new Error('Password change failed. please try again');
                error.statusCode = 401
                throw error
            }

            const updatePassword = await User.updateOne({ _id: userId }, { password: hashedPassword })

            if (!updatePassword) {
                const error = new Error('Password change failed. please try again');
                error.statusCode = 401
                throw error
            }

            await ResetPassword.deleteMany({ userId })


            return res.status(200).json({
                message: "Password has been reset successfully.",
                status: "success",
                // data: {
                //     id: userResponse._id.toString(),
                // },
            })

        }


    } catch (error) {
        next(error)
    }
}