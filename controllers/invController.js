const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId)
  if (isNaN(classification_id)) {
    return next({ status: 400, message: "Invalid classification ID" })
  }
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (!data || data.length === 0) {
    return next({ status: 404, message: "No vehicles found for this classification" })
  }
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  if (isNaN(inv_id)) {
    return next({ status: 400, message: "Invalid vehicle ID" })
  }
  const data = await invModel.getVehicleById(inv_id)
  if (!data) {
    return next({ status: 404, message: "Vehicle not found" })
  }
  const html = await utilities.buildVehicleHTML(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    html,
  })
}
/* ***************************
 *  Build error trigger function
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional server crash for testing!")
  } catch (error) {
    next({ status: 500, message: error.message })
  }
}
module.exports = invCont