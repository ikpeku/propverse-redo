const express = require("express");
const { sheet } = require("../../utils/googleClient");
const { errorHandler } = require("../../utils/error");

const route = express.Router();

route.post("/create", async(req,res,next) => {


    const {fullname, email, number, country, answer1, answer2, answer3, answer4,answer5, answer6} = req.body;

    if(!fullname || !email || !number || !country || !answer1 || !answer2 || !answer3 || !answer4 || !answer5 || !answer6) {
       return next(errorHandler(500, "all fields are required"))
    }

  try {
    await sheet.spreadsheets.values.append({
        spreadsheetId: process.env.SHEETID,
        range: "data!A2:J2",
        insertDataOption: "INSERT_ROWS",
        valueInputOption: "RAW",
        requestBody: {
            values:[[fullname, email, number, country, answer1, answer2, answer3, answer4,answer5, answer6]]
        }
       })
        // sheetID
    
    res.status(201).json({
        message: "success"
    })
  } catch (error) {
    next(errorHandler(500, "sending failed"))
    
  }



})


module.exports = route