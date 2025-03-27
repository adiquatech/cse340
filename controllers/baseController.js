baseController.buildHome = async function(req, res, next) {
    let nav = []
    try {
      nav = await utilities.getNav()
      console.log("Nav fetched:", nav.length)
    } catch (error) {
      console.error("Nav error:", error.message)
    }
    res.render("index", {title: "Home", nav}, { layout: false })
  }