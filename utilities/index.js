const invModel = require("../models/inventory-model")
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
}

module.exports = Util