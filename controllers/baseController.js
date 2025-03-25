const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav}, { layout: false })
  } catch (error) {
    console.error("BuildHome error:", error.message)
    next({ status: 500, message: `Home page error: ${error.message}` })
  }
}

module.exports = baseController