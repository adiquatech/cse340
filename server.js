/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");
const session = require("express-session");
const pool = require('./database/');
const bodyParser = require("body-parser");
const flash = require("connect-flash"); // Added flash import

/* ***********************
 * Middleware
 * ************************/
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        createTableIfMissing: true,
        pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
}));

app.use(flash()); // Flash middleware AFTER session

// Log session and flash messages for debugging
app.use((req, res, next) => {
    console.log("Session:", req.session);
    res.locals.messages = req.flash("messages");
    next();
});

//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
View Engine and Templates 
************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route
app.get("/", baseController.buildHome);
// Inventory routes
app.use("/inv", inventoryRoute);
// Account routes
app.use("/account", accountRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
    next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    if (err.status === 404) {
        res.render("errors/error", {
            title: "404 - Page Not Found",
            message: err.message,
            nav
        });
    } else {
        res.render("errors/error", {
            title: "500 - Server Error",
            message: "There was a crash. Try again later!",
            nav
        });
    }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 10000;
const host = process.env.HOST || "0.0.0.0";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
    console.log(`app listening on ${host}:${port}`);
    console.log("Server started successfully");
});