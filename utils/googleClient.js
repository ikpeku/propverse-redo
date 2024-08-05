const { google } = require("googleapis")


const client = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, [
    "https://www.googleapis.com/auth/spreadsheets"
])


exports.sheet = google.sheets({version: "v4", auth: client})