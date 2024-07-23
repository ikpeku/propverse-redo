
const jwt = require("jsonwebtoken");

exports.requestUser = async (req, res, next) => {
   
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1]

        jwt.verify(token, process.env.JWT_SIGN, (err, user) => {
            req.user = user
           
            next()
        })



    } else {
        req.user = undefined
           
        next()
        
    }



}