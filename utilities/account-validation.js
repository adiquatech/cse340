const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}


  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          try {
            const emailExists = await accountModel.checkExistingEmail(account_email);
            if (emailExists) {
              throw new Error("Email exists. Please log in or use different email");
            }
          } catch (error) {
            throw new Error("Error checking email: " + error.message);
          }
        }),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/registeration", {
        errors: errors.array(),

        title: "Registration",
        nav,
        messages: req.flash("messages"),
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  

  /*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
};

/* ******************************
* Check login data and return errors or continue to login
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      req.flash("messages", errors.array().map(error => error.msg));
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("messages"),
        account_email,
      });
    }
    next();
};

/* **********************************
 *  Account Update Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const existingAccount = await accountModel.getAccountByEmail(account_email);
        if (existingAccount && existingAccount.account_id != account_id) {
          throw new Error("Email already exists. Please use a different email.");
        }
      }),
  ];
};

/* **********************************
 *  Check Account Update Data
 * ********************************* */
validate.checkAccountUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    req.flash("messages", errors.array().map(error => ({ text: error.msg, type: "error" })));
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  next();
};

/* **********************************
 *  Password Update Validation Rules
 * ********************************* */
validate.passwordUpdateRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* **********************************
 *  Check Password Update Data
 * ********************************* */
validate.checkPasswordUpdateData = async (req, res, next) => {
  const { account_id, account_password } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    req.flash("messages", errors.array().map(error => ({ text: error.msg, type: "error" })));
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
  next();
};



  module.exports = validate