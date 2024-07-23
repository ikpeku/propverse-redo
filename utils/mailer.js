
const nodemailer = require("nodemailer");
require("dotenv").config()
const transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: 'gmail',
    type: "SMTP",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: true },
});


transporter.verify((error, success) => {
    if (error) {
        // console.log(error)
    } else {
        // console.log("success: ready to send message")
        // console.log(success)
    }
})





exports.mailerController = async(mailOptions, next) => {
    try {
       

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(info);
                }
            })

        })

    } catch (error) {
        next(error)
    }
} 