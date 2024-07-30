const { validationResult } = require("express-validator");
const User = require("../../model/user")


const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res, next) => {

    const { userId } = req.params

    const { currentPassword, newPassword } = req.body

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

        const user = await User.findById(userId)

        if (!user) {
            const error = new Error('A user with this name could not be found');
            error.statusCode = 401
            throw error
        }

        const isEqual = await bcrypt.compare(currentPassword, user.password);



        if (!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401
            throw error
        } else {

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


            return res.status(200).json({
                message: "Password has been updated successfully.",
                status: "success",
            })

        }


    } catch (error) {
        next(error)
    }
}