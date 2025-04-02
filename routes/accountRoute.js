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

<<<<<<< HEAD

=======
// Error handling middleware
router.use(async (err, req, res, next) => {
  console.error(`Account route error: ${err.message}`)
  next(err)
})
>>>>>>> 43a7ba244e6afc2dea1d7bbfb73f8aaaf93209ba

// GET route for /login
router.get("/registeration", accountController.buildRegister)

<<<<<<< HEAD
// // Error handling middleware
// router.use(async (err, req, res, next) => {
//   console.error(`Registeration route error: ${err.message}`)
//   next(err)
// })
=======
// Error handling middleware
router.use(async (err, req, res, next) => {
  console.error(`Registeration route error: ${err.message}`)
  next(err)
})
>>>>>>> 43a7ba244e6afc2dea1d7bbfb73f8aaaf93209ba

//
router.post(
  '/registeration', 
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

<<<<<<< HEAD

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
=======
>>>>>>> 43a7ba244e6afc2dea1d7bbfb73f8aaaf93209ba
module.exports = router