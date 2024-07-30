const User = require("../../model/user")
const Due_Deligence = require("../../model/developer/due_deligence")

exports.get_Due_deligence = async (req, res, next) => {
    const { userId } = req.params
    
    try {

       const data = await Due_Deligence.findById(userId)
       

       res.status(200).json({status:"success", data})


    } catch (error) {
        next(error)
    }
}