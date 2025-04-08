const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })


// Client-Side Validation Script

document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    const classification = document.getElementById('classificationList').value;
    const make = document.getElementById('inv_make').value;
    const model = document.getElementById('inv_model').value;
    const description = document.getElementById('inv_description').value;
    const price = document.getElementById('inv_price').value;
    const year = document.getElementById('inv_year').value;
    const miles = document.getElementById('inv_miles').value;
    const color = document.getElementById('inv_color').value;

    const makeModelRegex = /^[A-Za-z0-9 ]{3,}$/;
    const colorRegex = /^[A-Za-z ]+$/;
    const currentYear = new Date().getFullYear();

    if (!classification) {
    e.preventDefault();
    alert('Please select a classification.');
    return;
    }
    if (!makeModelRegex.test(make)) {
    e.preventDefault();
    alert('Make must be at least 3 characters long and contain only letters, numbers, and spaces.');
    return;
    }
    if (!makeModelRegex.test(model)) {
    e.preventDefault();
    alert('Model must be at least 3 characters long and contain only letters, numbers, and spaces.');
    return;
    }
    if (!description.trim()) {
    e.preventDefault();
    alert('Description is required.');
    return;
    }
    if (price <= 0) {
    e.preventDefault();
    alert('Price must be a positive number.');
    return;
    }
    if (year < 1900 || year > currentYear) {
    e.preventDefault();
    alert(`Year must be between 1900 and ${currentYear}.`);
    return;
    }
    if (miles < 0) {
    e.preventDefault();
    alert('Miles must be a positive number.');
    return;
    }
    if (!colorRegex.test(color)) {
    e.preventDefault();
    alert('Color must contain only letters and spaces.');
    return;
    }
});