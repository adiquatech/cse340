const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res, next) {
  let nav = []
  try {
    nav = await utilities.getNav()
    console.log("Nav fetched:", nav.length)
  } catch (error) {
    console.error("Nav error:", error.message)
  }
  req.flash("messages", "This is a flash message.")
  res.render("index", {title: "Home", nav}) // Remove { layout: false }
}

module.exports = baseController