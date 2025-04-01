const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const accountController = {};

/* ****************************************
 * Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    // messages: req.flash("messages"),
    messages: res.locals.messages,
  });
};

/* ****************************************
 * Deliver registration view
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/registeration", { 
    title: "Register",
    nav,
    errors: null,
    // messages: req.flash("messages"),
    messages: res.locals.messages,
  });
};


/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res) => {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Password validation (same as before)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
  if (!passwordRegex.test(account_password)) {
      req.flash(
          "messages",
          "Password must be at least 12 characters long, contain at least 1 capital letter, 1 number, and 1 special character."
      );
      return res.status(400).render("account/registeration", {
          title: "Register",
          nav,
          messages: req.flash("messages"),
      });
  }

  const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
  );

  if (regResult) {
      req.flash(
          "messages",
          `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.redirect("/account/login"); 
  } else {
      req.flash("messages", "Sorry, the registration failed.");
      res.status(501).render("account/registeration", {
          title: "Registration",
          nav,
      });
  }
};
module.exports = accountController;