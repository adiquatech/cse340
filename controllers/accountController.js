const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const accountController = {};
const bcrypt = require("bcryptjs")

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

  // // Password validation (same as before)
  // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
  // if (!passwordRegex.test(account_password)) {
  //     req.flash(
  //         "messages",
  //         "Password must be at least 12 characters long, contain at least 1 capital letter, 1 number, and 1 special character."
  //     );
  //     return res.status(400).render("account/registeration", {
  //         title: "Register",
  //         nav,
  //         messages: req.flash("messages"),
  //     });
  // }


  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("messages", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/registeration", {
      title: "Registration",
      nav,
      errors: null,
      messages: req.flash("messages"),
    })

  }

  const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
 );

  if (regResult) {
      req.flash(
          "messages",
          `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.redirect("/account/login"); 
  } else {
      req.flash("messages", "Sorry, the registration failed.");
      return res.status(501).render("account/registeration", {
          title: "Registration",
          nav,
          messages: req.flash("messages"),
      });
  }
};


module.exports = accountController;