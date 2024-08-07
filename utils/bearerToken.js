// const { errorHandler } = require("./error");
const jwt = require("jsonwebtoken");

const User = require("../model/user");


exports.getCurrentUser = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];

    // const response = await User.findById(payload.userId)
    //expected out-put: { email: user.email, userId: user._id, status: user.account_type}
  const payload = await jwt.verify(token, process.env.JWT_SIGN);

  if(payload) {
    const response = await User.findById(payload.userId)

     
    if (response) {
      // console.log(response)
      req.payload = payload;
      
    }

  }

  // console.log(payload)
  }  
  next();
};


// async (err, payload) => {

 
// }
