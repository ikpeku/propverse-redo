// user: {
//     type: SchemaTypes.ObjectId,
//     ref: "user",
//     required: true,
//   },
// isSubmitted: {
//   type: Boolean,
//   default: false,
// },

// isAdminAproved: {
//     type: String,
//     default: "Non Verified",
//     enums: ["Non Verified", "Verified", "Rejected"]
// },
// investment_status: {
//     type: String,
//     default: "Pending",
//     enums: ["Pending", "Completed"]
//   },
// property_type: {
//     type: String,
//     enums: ["new", "old"]
// },

const Properties = require("../../model/developer/properties");
const { errorHandler } = require("../../utils/error");


exports.isSubmmited = (req, res, next) => {
    req.body.isSubmitted = true
    next()
}

exports.isNotSubmmited = (req, res, next) => {
    req.body.isSubmitted = false
    next()
}

exports.isNew = (req, res, next) => {
    req.body.property_type = "new"
    next()
}

exports.isOld = (req, res, next) => {
    req.body.property_type = "old"
    next()
}




exports.submitProperties = async() => {

    const {} = req.body;

    console.log(req.payload)

    try {

        
    } catch (error) {
        
    }

}

