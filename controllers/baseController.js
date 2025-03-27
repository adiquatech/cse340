const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
  console.log("Entering buildHome")
  let nav = []
  try {
    nav = await utilities.getNav()
    console.log("Nav fetched:", nav.length)
  } catch (error) {
    console.error("Nav error:", error.message)
  }
  console.log("Rendering index")
  res.send("Home page with nav: " + JSON.stringify(nav))
}

module.exports = baseController