const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const Authentication = require("./routes/auth/authentication")
const Developer = require("./routes/developer/developerroute")
const Admin = require("./routes/admin/adminRoute")
const Institutional = require("./routes/institutional/fundRoute")
const Non_Institutional = require("./routes/noninstitutional/noninstitutionalRoute")
const FilesData = require("./routes/files/FilesData")
const Sheet = require("./routes/googlesheet/sheet")
const General = require("./routes/general/user")

const { config } = require("dotenv");
// const { corsConfigs } = require("./utils/corsConfig");
const { getCurrentUser } = require("./utils/bearerToken");
const app = express();
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.options('*', cors(corsOptions))
app.use(cors(corsOptions))


// app.use(cors(corsConfigs))

config({ path: "./.env" });

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


app.use(getCurrentUser)

app.use("/api/auth",cors(corsOptions), Authentication)
app.use("/api/developer",cors(corsOptions), Developer)
app.use("/api/admin",cors(corsOptions), Admin)
app.use("/api/institutional",cors(corsOptions), Institutional )
app.use("/api/non-Instititution",cors(corsOptions), Non_Institutional )
app.use("/api/file", cors(corsOptions), FilesData)
app.use("/api/sheet", cors(corsOptions),Sheet)
app.use("/api/user", cors(corsOptions),General)
// suspend account

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
    res.status(status).json({status: "failed", message, succeeded: false ,data })
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

