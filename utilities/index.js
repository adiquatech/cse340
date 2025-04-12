const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken");
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
};


/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="vehicle-grid">'
    data.forEach(vehicle => { 
      grid += '<div class="vehicle-card">'
      grid += '<img src="' + vehicle.inv_thumbnail + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
      grid += '<div class="card-info">'
      grid += '<h2><a href="/inv/detail/' + vehicle.inv_id + '">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a></h2>'
      grid += '<p class="price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
      grid += '</div>'
      grid += '</div>'
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};


/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleHTML = async function(vehicle) {
  let html = '<div class="vehicle-detail">'
  html += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`
  html += '<div class="vehicle-info">'
  html += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`
  html += `<p><strong>Price:</strong> ${Number(vehicle.inv_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>`
  html += `<p><strong>Mileage:</strong> ${Number(vehicle.inv_miles).toLocaleString('en-US')} miles</p>`
  html += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`
  html += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
  html += '</div>'
  html += '</div>'
  return html
};


/* **************************************
 * Build the classification dropdown list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};


/* ***************************
 *  Middleware to handle errors in route handlers
 * ************************** */
Util.handleErrors = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error("Error at:", req.originalUrl, ":", err);
    const nav = await Util.getNav();
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: err.message || "An unexpected error occurred. Please try again later.",
      nav,
    });
  }
};



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 };


 /* ******************************
* CheckLogin
* ***************************** */
Util.checkLogin = async(req, res, next) => {
  if (req.cookies.jwt) {
    next();
  } else {
    req.flash("messages", [{ text: "Please log in to access this page.", type: "error" }]);    
    res.redirect("/account/login");
  }
};


/* ****************************************
 * Middleware to restrict access to admin views
 * Only allows "Employee" or "Admin" account types
 **************************************** */
Util.restrictAdminAccess = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      next();
    } else {
      req.flash("messages", [{ text: "Access denied. You must be an Employee or Admin to access this page.", type: "error" }]);
      res.redirect("/account/login");
    }
  } else {
    req.flash("messages", [{ text: "Please log in to access this page.", type: "error" }]);
    res.redirect("/account/login");
  }
};



module.exports = Util