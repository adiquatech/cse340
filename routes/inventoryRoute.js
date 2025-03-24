// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// New route for vehicle detail view
router.get("/detail/:invId", invController.buildByVehicleId);

//New route for error test
router.get("/error-test", invController.triggerError)

module.exports = router;