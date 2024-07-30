const User = require("../../model/user");

const jwt = require("jsonwebtoken");

const authToken = require("../../middleware/refreshToken");
const { errorHandler } = require("../../utils/error");

require("dotenv").config();

exports.tokenValidate = async (req, res, next) => {
  const { token: userToken } = req?.body;

  const authTokenInit = new authToken();


  if(!userToken) next(errorHandler(501, "token not provided"));

  try {
    const decodedToken = jwt.verify(userToken, process.env.JWT_SIGN);


    const user = await User.findById(decodedToken?.userId);

    if (!user) {
      return;
    }

    
      const data = await authTokenInit.createToken(user);
      res
        // .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
        .status(200)
        .json({
          message: "successful",
          data,
        });
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
