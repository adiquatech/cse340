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
router.get("/error-test", invController.triggerError);

// Route for inventory management view
router.get("/", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildManagement));

// Route to render the add-classification view
router.get("/add-classification", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildAddClassification));

// Route to render the add-inventory view
router.get("/add-inventory", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildAddInventory));

//Route to get inventory json
router.get("/getInventory/:classification_id", utilities.restrictAdminAccess, utilities.handleErrors(invController.getInventoryJSON));

// Route to fetch all classifications as JSON
router.get(
  "/getClassifications", utilities.restrictAdminAccess, utilities.handleErrors(invController.getClassificationsJSON));

//Edit inventory view
router.get("/edit/:inv_id", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildEditInventoryView));

// Route to fetch a single classification by ID as JSON
router.get(
  "/getClassificationsById/:classification_id", utilities.restrictAdminAccess, utilities.handleErrors(invController.getClassificationByIdJSON));

// Route to render the delete 
router.get("/delete/:inv_id", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildDeleteInventoryView));

// Route to handle add-classification form submission
router.post(
    "/add-classification",
    utilities.restrictAdminAccess,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  );

  router.get(
    "/add-classification", 
    utilities.restrictAdminAccess, 
    utilities.handleErrors(invController.buildAddClassification));

// Route to handle add-inventory form submission
router.post(
  "/add-inventory",
  utilities.restrictAdminAccess,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

//Route to handle inventory update
router.post(
  "/update/", 
  utilities.restrictAdminAccess,
  invValidate.inventoryRules(), 
  invValidate.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory)
);

// Route to handle inventory deletion
router.post(
  "/delete/", 
  utilities.restrictAdminAccess,
  utilities.handleErrors(invController.deleteInventory)
);

// Route to display delete classification confirmation view
router.get(
  "/delete-classification/:classification_id", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildDeleteClassificationView));

router.post(
  "/delete-classification",
  utilities.restrictAdminAccess,
  utilities.handleErrors(invController.deleteClassification)
);


// Route to display edit classification view
router.get(
  "/edit-classification/:classification_id", utilities.restrictAdminAccess, utilities.handleErrors(invController.buildEditClassificationView));

router.post(
  "/update-classification",
  utilities.restrictAdminAccess,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.updateClassification)
);
  
module.exports = router;
