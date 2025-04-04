const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name can only contain letters and numbers (no spaces or special characters).")
      .custom(async (classification_name) => {
        try {
          const invModel = require("../models/inventory-model");
          const existing = await invModel.checkExistingClassification(classification_name);
          if (existing) {
            throw new Error("Classification name already exists.");
          }
        } catch (error) {
          throw new Error("Error checking classification: " + error.message);
        }
      }),
  ];
};

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav;
    try {
      nav = await require("../utilities/").getNav();
    } catch (error) {
      console.error("Error fetching nav in checkClassificationData:", error);
      nav = "<ul><li><a href='/'>Home</a></li></ul>";
    }
    req.flash("messages", errors.array().map(error => error.msg));
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash("messages"),
      classification_name,
    });
  }
  next();
};

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification.")
      .isInt()
      .withMessage("Classification ID must be a number.")
      .custom(async (classification_id) => {
        const invModel = require("../models/inventory-model");
        const classifications = await invModel.getClassifications();
        const exists = classifications.rows.some(row => row.classification_id == classification_id);
        if (!exists) {
          throw new Error("Selected classification does not exist.");
        }
      }),
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .matches(/^[A-Za-z0-9 ]{3,}$/)
      .withMessage("Make must be at least 3 characters long and contain only letters, numbers, and spaces."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .matches(/^[A-Za-z0-9 ]{3,}$/)
      .withMessage("Model must be at least 3 characters long and contain only letters, numbers, and spaces."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .matches(/^\/images\/vehicles\/.*\.png$/)
      .withMessage("Image path must be a valid path to a .png file in /images/vehicles/."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .matches(/^\/images\/vehicles\/.*\.png$/)
      .withMessage("Thumbnail path must be a valid path to a .png file in /images/vehicles/."),
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}.`),
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
      .matches(/^[A-Za-z ]+$/)
      .withMessage("Color must contain only letters and spaces."),
  ];
};

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav;
    let classificationList;
    try {
      nav = await require("../utilities/").getNav();
      classificationList = await require("../utilities/").buildClassificationList(classification_id);
    } catch (error) {
      console.error("Error in checkInventoryData:", error);
      nav = "<ul><li><a href='/'>Home</a></li></ul>";
      classificationList = "<select name='classification_id' id='classificationList' required><option value=''>Choose a Classification</option></select>";
    }
    req.flash("messages", errors.array().map(error => error.msg));
    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      messages: req.flash("messages"),
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }
  next();
};

module.exports = validate;