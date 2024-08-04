const mongoose = require("mongoose");
const Schema = mongoose.Schema

const loginAdmin = new Schema({
    userId: String,
    loginString: String,
    createdAt: Date,
    expiresAt: Date
})

module.exports = mongoose.model('loginAdmin', loginAdmin)