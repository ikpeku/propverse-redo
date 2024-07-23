const { errorHandler } = require("./error");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    const { userId } = req.params

    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1]

        jwt.verify(token, process.env.JWT_SIGN, (err, user) => {
            req.user = user
            if (userId !== user?.userId) next(errorHandler(403, "route forbidden"))
            next()
        })



    } else {
        return next(errorHandler(401, "Forbidden"))
    }



}


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

exports.verifyAdminToken = async (req, res, next) => {
    // const { userId } = req.params
    // status: 'Admin'
    const bearerHeader = req.headers["authorization"];

    if(bearerHeader) {
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const token = bearer[1]
    
            jwt.verify(token, process.env.JWT_SIGN, (err, user) => {
                req.user = user
               
               return next()
            })
    
        } else {
            return next(errorHandler(401, "Forbidden"))
        }

    } else {
       return next()
    }


}