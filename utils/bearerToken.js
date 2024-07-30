const { errorHandler } = require("./error");
const jwt = require("jsonwebtoken");

// exports.verifyToken = async (req, res, next) => {
//     const { userId } = req.params

//     const bearerHeader = req.headers["authorization"];

//     if (typeof bearerHeader !== "undefined") {
//         const bearer = bearerHeader.split(" ");
//         const token = bearer[1]

//         jwt.verify(token, process.env.JWT_SIGN, (err, user) => {
//             req.user = user
//             if (userId !== user?.userId) next(errorHandler(403, "route forbidden"))
//             next()
//         })



//     } else {
//         return next(errorHandler(401, "Forbidden"))
//     }



// }



// exports.verifyAdminToken = async (req, res, next) => {
//     // const { userId } = req.params
//     // status: 'Admin'
//     const bearerHeader = req.headers["authorization"];

//     if(bearerHeader) {
//         if (typeof bearerHeader !== "undefined") {
//             const bearer = bearerHeader.split(" ");
//             const token = bearer[1]
    
//             jwt.verify(token, process.env.JWT_SIGN, (err, user) => {
//                 req.user = user
               
//                return next()
//             })
    
//         } else {
//             return next(errorHandler(401, "Forbidden"))
//         }

//     } else {
//        return next()
//     }


// }



exports.getCurrentUser = async(req, res, next) => {

    const bearerHeader = req.headers["authorization"];

    if(bearerHeader) {
        if(typeof bearerHeader !== "undefined") {
            const token =  bearerHeader.split(" ")[1];

            //expected out-put: { email: user.email, userId: user._id, status: user.account_type}
        const  result = await  jwt.verify(token, process.env.JWT_SIGN, async(err, payload) => {
                if(payload) {
                    req.payload = payload
                        next()
                } 
            })

            if(!result) {
                  next()
            }
            
        } else {
            next()
        }

    } else {
       next()
    }




}
