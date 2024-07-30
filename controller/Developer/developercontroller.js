const User = require("../../model/user")


const bcrypt = require("bcryptjs");

exports.get_Due_deligence = async (req, res, next) => {

    const { userId } = req.params

    console.log("payload: ",req.payload)

    
    try {
       
        // const user = await User.findById(userId)

       res.json({status:"success"})


    } catch (error) {
        next(error)
    }
}