/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * Base COntroller
 *************************/
const baseController = require("./controllers/baseController")
console.log("Starting server...");

/* ***********************
View Engine and Templates */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

app.get("/test", (req, res) => {
  res.send("Render test works!")
})

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status === 404) {
    res.render("errors/error", {
      title: "404 - Page Not Found",
      message: err.message,
      nav
    })
  } else {
    res.render("errors/error", {
      title: "500 - Server Error",
      message: "There was a crash. Try again later!",
      nav
    })
  }
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 10000
const host = process.env.HOST || "0.0.0.0"

console.log("Environment vars:", {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  NODE_ENV: process.env.NODE_ENV
});

/* ***********************
 * Log statement to confirm server operation
 *************************/
try {
  app.listen(port, host, () => {
    console.log(`app listening on ${host}:${port}`)
    console.log("Server started successfully");
  })
} catch (error) {
  console.error(`Server startup failed: ${error.message}`);
  process.exit(1);
}


