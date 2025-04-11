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
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    errors: null,
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
    nav = "<ul><li><a href='/'>Home</a></li></ul>";
  }

  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      // Update navigation
      nav = await utilities.getNav();
      req.flash("messages", [{ text: "Classification added successfully.", type: "success" }]);      
      return res.status(201).redirect("/inv/");
    } else {
      req.flash("messages", [{ text: "Sorry, the classification could not be added.", type: "error" }]);      
      return res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        classification_name,
      });
    }
  } catch (error) {
    console.error("Error in addClassification:", error);
    req.flash("messages", [{ text: "Sorry, the classification could not be added.", type: "error" }]);    
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
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
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
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
      nav = await utilities.getNav();
      req.flash("messages", [{ text: "Inventory item added successfully.", type: "success" }]);
      return res.status(201).redirect("/inv/");
    } else {
      req.flash("messages", [{ text: "Sorry, the inventory item could not be added.", type: "error" }]);      
      return res.status(500).render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
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
    req.flash("messages", [{ text: "An error occurred while adding the inventory item: " + error.message, type: "error" }]);    
    return res.status(500).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  const classificationList = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("messages", [{ text: `The ${itemName} was successfully updated.`, type: "success" }]);    
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("messages", [{ text: "Sorry, the update failed.", type: "error" }]);    
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};


/* ***************************
 *  Build delete inventory confirmation view
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    req.flash("messages", [{ text: "The inventory item was successfully deleted.", type: "success" }]);
    res.redirect("/inv/");
  } else {
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    req.flash("messages", [{ text: "Sorry, the deletion failed.", type: "error" }]);
    res.status(501).redirect(`/inv/delete/${inv_id}`);
  }
};


module.exports = invCont