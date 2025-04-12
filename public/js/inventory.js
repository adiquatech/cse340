'use strict' 
 
// Fetch and display the selected classification for management when the dropdown changes
let classificationListManage = document.querySelector("#classificationListManage");
classificationListManage.addEventListener("change", function () {
  let classification_id = classificationListManage.value;
  console.log(`Selected classification_id for management: ${classification_id}`);
  if (classification_id) {
    fetchClassifications(classification_id);
  } else {
    // Clear the table if no classification is selected
    document.getElementById("classificationDisplay").innerHTML = "";
  }
});

 // Fetch and display inventory items when the inventory dropdown changes
let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id for inventory: ${classification_id}`);
  if (classification_id) {
    let classIdURL = "/inv/getInventory/" + classification_id;
    fetch(classIdURL)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw Error("Network response was not OK");
      })
      .then(function (data) {
        console.log("Inventory data:", data);
        buildInventoryList(data);
      })
      .catch(function (error) {
        console.log('There was a problem fetching inventory: ', error.message);
        document.getElementById("inventoryDisplay").innerHTML =
          '<p class="notice">Error loading inventory. Please try again later.</p>';
      });
  } else {
    // Clear the table if no classification is selected
    document.getElementById("inventoryDisplay").innerHTML = "";
  }
});

 // Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td> </td><td> </td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row
    if (data && data.length > 0) {
      data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
      });
    } else {
      dataTable += '<tr><td colspan="3">No inventory items found.</td></tr>';
    }
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
  };








  // Function to fetch a single classification by ID
function fetchClassifications(classification_id) {
    let classURL = `/inv/getClassificationsById/${classification_id}`;
    console.log("Fetching classification from URL:", classURL);
    fetch(classURL)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw Error("Network response was not OK");
      })
      .then(function (data) {
        console.log("Classification data:", data);
        buildClassificationList(data);
      })
      .catch(function (error) {
        console.log('There was a problem fetching the classification: ', error.message);
        document.getElementById("classificationDisplay").innerHTML =
          '<p class="notice">Error loading classification. Please try again later.</p>';
      });
  }
  
  // Build the selected classification into an HTML table and inject into DOM
function buildClassificationList(data) {
    let classificationDisplay = document.getElementById("classificationDisplay");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Classification Name</th><td> </td><td> </td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Check if data exists (single classification object)
    if (data && data.classification_id) {
      console.log(data.classification_id + ", " + data.classification_name);
      dataTable += `<tr><td>${data.classification_name}</td>`;
      dataTable += `<td><a href='/inv/edit-classification/${data.classification_id}' title='Click to modify'>Modify</a></td>`;
      dataTable += `<td><a href='/inv/delete-classification/${data.classification_id}' title='Click to delete'>Delete</a></td></tr>`;
    } else {
      dataTable += '<tr><td colspan="3">Classification not found.</td></tr>';
    }
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    classificationDisplay.innerHTML = dataTable;
  }