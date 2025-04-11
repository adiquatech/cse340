const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const accountController = {};
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 * Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
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
  });
};


/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res) => {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

 
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("messages", [{ text: "Sorry, there was an error processing the registration.", type: "error" }]);
    res.status(500).render("account/registeration", {
      title: "Registration",
      nav,
      errors: null,
    })

  }

  const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
 );

  if (regResult) {
    req.flash("messages", [{ text: `Congratulations, you're registered ${account_firstname}. Please log in.`, type: "success" }]);
      return res.redirect("/account/login"); 
  } else {
    req.flash("messages", [{ text: "Sorry, the registration failed.", type: "error" }]);
      return res.status(501).render("account/registeration", {
          title: "Registration",
          nav,

      });
  }
};


/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("messages", [{ text: "Please check your credentials and try again.", type: "error" }]);
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("messages", [{ text: "Login successful!", type: "success" }]);
      return res.redirect("/account/")
    }
    else {
      req.flash("messages", [{ text: "Please check your credentials and try again.", type: "error" }]);
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
 * Deliver Account Management View
 * *************************************** */
accountController.buildAccountManagement = async (req, res, next) => {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData; // From checkJWTToken middleware
  if (!accountData) {
    req.flash("messages", [{ text: "Please log in to access this page.", type: "error" }]);
    return res.redirect("/account/login");
  }
  res.render("account/management", {
    title: "Account Management",
    nav,
    account_firstname: accountData.account_firstname,
    account_type: accountData.account_type,
  });
};


/* ****************************************
 * Process Logout
 * *************************************** */
accountController.logout = async (req, res, next) => {
  res.clearCookie("jwt");
  req.flash("messages", [{ text: "You have been logged out.", type: "success" }]);
  return res.redirect("/");
};


/* ****************************************
 * Build Account Update
 * *************************************** */
accountController.buildAccountUpdateView = async (req, res, next) => {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  if (!accountData) {
    req.flash("messages", [{ text: "Account not found.", type: "error" }]);
    return res.redirect("/account/");
  }
  res.render("account/update", {
    title: "Update Account",
    nav,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    error: null,
  });
};


/* ****************************************
 * Process Password Update
 * *************************************** */
accountController.updatePassword = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      // Update the JWT with the new account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      delete updatedAccount.account_password;
      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }

      req.flash("messages", [{ text: "Password updated successfully.", type: "success" }]);
      return res.redirect("/account/");
    } else {
      req.flash("messages", [{ text: "Sorry, the password update failed.", type: "error" }]);
      const accountData = await accountModel.getAccountById(account_id);
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error in updatePassword:", error);
    req.flash("messages", [{ text: "An error occurred while updating the password: " + error.message, type: "error" }]);
    const accountData = await accountModel.getAccountById(account_id);
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      errors: null,
    });
  }
};


/* ****************************************
 * Process Account Information Update
 * *************************************** */
accountController.updateAccountInfo = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Update the JWT with the new account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      delete updatedAccount.account_password; // Remove password from the data
      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }

      req.flash("messages", [{ text: "Account information updated successfully.", type: "success" }]);
      return res.redirect("/account/");
    } else {
      req.flash("messages", [{ text: "Sorry, the update failed.", type: "error" }]);
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error in updateAccountInfo:", error);
    req.flash("messages", [{ text: "An error occurred while updating the account: " + error.message, type: "error" }]);
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    });
  }
};

module.exports = accountController;
