// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// New route for vehicle detail view
router.get("/detail/:invId", invController.buildByVehicleId);

//New route for error test
router.get("/error-test", invController.triggerError)

// Route for inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to render the add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to handle add-classification form submission
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  );


// Route to render the add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to handle add-inventory form submission
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
