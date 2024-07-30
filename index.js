const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const Authentication = require("./routes/auth/authentication")

const { config } = require("dotenv");
const { corsConfigs } = require("./utils/corsConfig");
const { requestUser } = require("./utils/userCookie");
const app = express();

config({ path: "./.env" });


// app.use(cookieParser());
app.use(cors(corsConfigs))


const PORT = process.env.PORT || 5000;

////// URL FOR THE PROJECT
const prodUrl = `http://127.0.0.1:${PORT}`;
const liveUrl = `${process.env.currentUrl}:${PORT}`;
const currentUrl = liveUrl || prodUrl;

//// DATABASE URL local: process.env.MONGODB_URI ||| cloud:process.env.databaseUrl
const dbUrl = process.env.databaseUrl || process.env.MONGODB_URI;

// create application/json parser
const jsonParser = bodyParser.json();

app.use(jsonParser);


app.use(requestUser)

app.use("/api/auth", Authentication)


/**
 * test route
 */
app.get("/", (req, res, next) => {
    res.status(200).send("API is running");
});


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data })
})


mongoose
    .connect(dbUrl, {
        autoIndex: true
    })
    .then((response) => {
        if (response) {
            app.listen(PORT, () => {
                console.log(`Connected on PORT ${PORT} || ${currentUrl}`);
            });
        }
    })
    .catch((e) => {
        console.log(e);
    });

// Export the Express API
module.exports = app;

