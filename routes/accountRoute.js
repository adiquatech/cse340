/* ******************************************
 * accountRoute.js
 *******************************************/
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const Validate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")



// GET route for /login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// GET route for /registration
router.get("/registeration", utilities.handleErrors(accountController.buildRegister));
//
router.post(
  '/registeration', 
  Validate.registrationRules(),
  Validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  Validate.loginRules(),
  Validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin));


// Default route for account management view
router.get(
  "/",
  utilities.checkLogin, // Middleware to ensure the user is logged in
  utilities.handleErrors(accountController.buildAccountManagement));

// Route to render the account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdateView));

// Route to process account information update
router.post(
  "/update-info",
  utilities.checkLogin,
  Validate.accountUpdateRules(),
  Validate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// Route to process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  Validate.passwordUpdateRules(),
  Validate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to handle logout
router.get(
  "/logout", 
  utilities.handleErrors(accountController.logout)
);




// Error handling middleware
router.use(async (err, req, res, next) => {
  console.error(`Account route error: ${err.message}`);
  const nav = await utilities.getNav().catch(() => "<ul><li><a href='/'>Home</a></li></ul>"); // Fallback nav
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "An unexpected error occurred. Please try again later.",
    nav,
  });
});

module.exports = router