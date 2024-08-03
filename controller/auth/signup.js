const User = require("../../model/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { sendSignUpVerifyEmail } = require("../../middleware/sendMail");

const { v4: uuidv4 } = require("uuid");

exports.signUpUser = async (req, res, next) => {
  const errors = validationResult(req);

  const { username, email, password, account_type, phone_number, country, refId} =
    req.body;


  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg)[0];

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const phone = phone_number ? phone_number : "08 XXX XXXX";
    const userName = username ? username : email.split("@")[0];

    const referralId = uuidv4().split("-")[1];

    const userResponse = await User.create({
      username: userName,
      password: hashedPassword,
      email,
      account_type,
      phone_number: phone,
      country,
      referral: { referralId },
    });


    // if (refId) {
    //   await Referral.create({ userId: userResponse?._id, referralId: refId });
    // }

    if (!userResponse) {
      throw new Error("User data is not valid");
    }

    await sendSignUpVerifyEmail(
      userResponse,
      res,
      next,
      referralId,
      (islogin = false)
    );
  } catch (error) {
    next(error);
  }
};

exports.signUpAdmin = async (req, res, next) => {
  

  const {  email, password } = req.body;


  try {
  
   
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);


    const referralId = uuidv4().split("-")[1];

    const user = await User.findOne({email})
    console.log(user)
    console.log(req.body)
    if (user) {
      throw new Error("User already register please login");
    }

    const userResponse = await User.create({
      username: "Admin",
      password: hashedPassword,
      email,
      account_type: "Admin",
      phone_number:  "08 XXX XXXX",
      country: "Nigeria",
      referral: { referralId },
    });


    if (!userResponse) {
      throw new Error("User data is not valid");
    }

    res.status(200).json({message: "success"})

  
  } catch (error) {
    next(error);
  }
};
