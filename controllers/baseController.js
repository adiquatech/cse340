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
  req.flash("messages", [{ text: "This is a flash message.", type: "success" }]);
  res.render("index", {title: "Home", nav}) // Remove { layout: false }
}

module.exports = baseController