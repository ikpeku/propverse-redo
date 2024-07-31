
// const Due_Deligence = require("../../../model/developer/due_deligence")
const Developers = require("../../../model/user")
const { errorHandler } = require("../../../utils/error")

exports.get_Developers = async (req, res, next) => {

    const { userId } = req.params

    const {userId: payloadUserId, status} = req.payload
    
    try {

        // if((userId === payloadUserId && status === "Admin") ) {
            const data = await Developers.find({account_type: "Developer", verify_account: true }).select("username country email  createdAt ")
            // .select("username country email  createdAt ") 

const response = data.paginate()
            
           return res.status(200).json({status:"success", data: response})
            
    //     } 



    //    return next(errorHandler(400, "Unauthorise"))

    } catch (error) {
        next(error)
    }
}