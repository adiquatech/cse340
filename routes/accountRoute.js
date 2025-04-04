/* ******************************************
 * accountRoute.js
 *******************************************/
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// GET route for /login
router.get("/login", accountController.buildLogin)

// GET route for /login
router.get("/registeration", accountController.buildRegister)

//
router.post(
  '/registeration', 
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

// Error handling middleware
router.use(async (err, req, res, next) => {
  console.error(`Account route error: ${err.message}`)
  next(err)
})


module.exports = router