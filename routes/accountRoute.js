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

// Error handling middleware
router.use(async (err, req, res, next) => {
  console.error(`Account route error: ${err.message}`)
  next(err)
})

// GET route for /login
router.get("/registeration", accountController.buildRegister)

// Error handling middleware
router.use(async (err, req, res, next) => {
  console.error(`Registeration route error: ${err.message}`)
  next(err)
})

//
router.post(
  '/registeration', 
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

module.exports = router