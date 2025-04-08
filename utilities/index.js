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
}

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
}

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
    console.error(err.stack);
    const nav = await Util.getNav(); // Fetch navigation dynamically
    req.flash("messages", err.message || "An error occurred. Please try again.");
    res.status(500).render(req.path.includes("registeration") ? "account/registeration" : "account/login", {
      title: req.path.includes("registeration") ? "Register" : "Login",
      nav,
      errors: null,
      messages: req.flash("messages"),
      account_firstname: req.body.account_firstname || "",
      account_lastname: req.body.account_lastname || "",
      account_email: req.body.account_email || "",
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
    req.flash("messages", "Please log in to access this page");
    res.redirect("/account/login");
  }
};



module.exports = Util