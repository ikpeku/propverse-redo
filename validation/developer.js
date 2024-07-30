const { body, param } = require("express-validator");


exports.developerInfoValidator = [
    param("userId").trim().notEmpty().withMessage("userId not found"),
]

exports.developerProjectInfoValidator = [
    param("userId").trim().notEmpty().withMessage("userId not found"),
    param("projectId").trim().notEmpty().withMessage("projectId not found")
]