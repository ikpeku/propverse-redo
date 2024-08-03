const { body, param } = require("express-validator");
const User = require("../model/user");

exports.registrationValidator = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      try {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("E-mail address already exists!");
        }
        return true;
      } catch (error) {
        throw error; // Re-throw the error for proper handling
      }
    }),
  // .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)
    .withMessage("Password must contain at least one special character"),

  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number should be a number"),
];

exports.registrationInstitutionalInvestorValidator = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  body("account_type")
    .trim()
    .notEmpty()
    .exists()
    .withMessage("account_type is Requiered")
    .isIn(["Institutional Investor"])
    .withMessage("account_type does not contain invalid value"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      try {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("E-mail address already exists!");
        }
        return true;
      } catch (error) {
        throw error; // Re-throw the error for proper handling
      }
    }),
  // .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)
    .withMessage("Password must contain at least one special character"),

  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number should be a number"),
];

exports.googleRegistrationValidator = [
  body("userName").trim().notEmpty().withMessage("Username is required"),

  body("account_type")
    .trim()
    .notEmpty()
    .exists()
    .withMessage("account_type is Requiered")
    .isIn([
      "Institutional Investor",
      "Project manager",
      "Non Institutional Investor",
    ])
    .withMessage("account_type does not contain invalid value"),

  body("email").trim().isEmail().withMessage("Please enter a valid email."),
  // .normalizeEmail(),

  body("avatar").trim().notEmpty().withMessage("avatar is required"),
];

exports.developerRegistrationValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      try {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("E-mail address already exists!");
        }
        return true;
      } catch (error) {
        throw error; // Re-throw the error for proper handling
      }
    }),
  // .normalizeEmail()

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)
    .withMessage("Password must contain at least one special character"),

  // body("account_type")
  //   .trim()
  //   .notEmpty()
  //   .exists()
  //   .withMessage("account_type is Requiered")
  //   .isIn(["Project manager"])
  //   .withMessage("account_type does not contain invalid value"),
];

exports.loginValidator = [
  body("email").trim().isEmail().withMessage("Please enter a valid email."),
  // .normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

exports.verifyuserValidator = [
  body("userId").trim().notEmpty().withMessage("userId not found"),
  body("token").trim().notEmpty().withMessage("validation errors"),
];

exports.forgetPassWordValidator = [
  body("email").trim().isEmail().withMessage("Please enter a valid email."),
  // .normalizeEmail(),
];

exports.resendForgetPassWordValidator = [
  body("email").trim().isEmail().withMessage("Please enter a valid email."),
  // .normalizeEmail(),
  body("userId").trim().notEmpty().withMessage("userId not found"),
];

// , ,
exports.resetPassWordValidator = [
  body("userId").trim().notEmpty().withMessage("userId not found"),
  // body("token").trim().notEmpty().withMessage("invalid token"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)
    .withMessage("Password must contain at least one special character"),
];

exports.changePassWordValidator = [
  param("userId").trim().notEmpty().withMessage("userId not found"),
  body("currentPassword").trim().notEmpty().withMessage("invalid token"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)
    .withMessage("Password must contain at least one special character"),
];

exports.userDetailValidator = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("userId not found")
    .custom(async (value, { req }) => {
      try {
        const userDoc = await User.findById(value);
        if (!userDoc) {
          throw new Error("user id not valid not found");
        }
        return true;
      } catch (error) {
        throw new Error("user id not valid not found"); // Re-throw the error for proper handling
      }
    }),
];

exports.userPayOutValidator = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("userId not found")
    .custom(async (value, { req }) => {
      try {
        const userDoc = await User.findById(value);
        if (!userDoc) {
          throw new Error("user id not valid not found");
        }
        return true;
      } catch (error) {
        throw new Error("user id not valid not found"); // Re-throw the error for proper handling
      }
    }),
  body("bank_name").trim().notEmpty().withMessage("bank_name is required"),
  body("account_number")
    .trim()
    .notEmpty()
    .withMessage("account_number is required"),
  body("account_name")
    .trim()
    .notEmpty()
    .withMessage("account_name is required"),
];
