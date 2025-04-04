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


/* ****************************************
 * Deliver inventory management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash("messages"),
  });
};


/* ****************************************
 * Deliver add-classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: req.flash("messages"),
    classification_name: "",
  });
};

/* ****************************************
 * Process Add Classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav;
  try {
    nav = await utilities.getNav();
  } catch (error) {
    console.error("Error fetching nav in addClassification:", error);
    nav = "<ul><li><a href='/'>Home</a></li></ul>"; // Fallback nav
  }

  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      // Update navigation
      nav = await utilities.getNav(); // Re-fetch nav to include the new classification
      req.flash("messages", "Classification added successfully.");
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("messages"),
      });
    } else {
      req.flash("messages", "Sorry, the classification could not be added.");
      return res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        messages: req.flash("messages"),
        classification_name,
      });
    }
  } catch (error) {
    console.error("Error in addClassification:", error);
    req.flash("messages", "An error occurred while adding the classification: " + error.message);
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash("messages"),
      classification_name,
    });
  }
};


/* ****************************************
 * Deliver add-inventory view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav;
  let classificationList;
  try {
    nav = await utilities.getNav();
    classificationList = await utilities.buildClassificationList();
  } catch (error) {
    console.error("Error in buildAddInventory:", error);
    nav = "<ul><li><a href='/'>Home</a></li></ul>";
    classificationList = "<select name='classification_id' id='classificationList' required><option value=''>Choose a Classification</option></select>";
  }
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    messages: req.flash("messages"),
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.jpg",
    inv_thumbnail: "/images/vehicles/no-image-tn.jpg",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: "",
  });
};

/* ****************************************
 * Process Add Inventory
 * *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav;
  let classificationList;
  try {
    nav = await utilities.getNav();
    classificationList = await utilities.buildClassificationList(req.body.classification_id);
  } catch (error) {
    console.error("Error in addInventory:", error);
    nav = "<ul><li><a href='/'>Home</a></li></ul>";
    classificationList = "<select name='classification_id' id='classificationList' required><option value=''>Choose a Classification</option></select>";
  }

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

  try {
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );
    if (result) {
      nav = await utilities.getNav(); // Re-fetch nav to include any new classifications
      req.flash("messages", "Inventory item added successfully.");
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("messages"),
      });
    } else {
      req.flash("messages", "Sorry, the inventory item could not be added.");
      return res.status(500).render("inventory/add-inventory", {
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
  } catch (error) {
    console.error("Error in addInventory:", error);
    req.flash("messages", "An error occurred while adding the inventory item: " + error.message);
    return res.status(500).render("inventory/add-inventory", {
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
};


module.exports = invCont