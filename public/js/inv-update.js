//Client-Side Validation Script for add-classification
const classificationForm = document.getElementById('classificationForm');
if (classificationForm) {
    classificationForm.addEventListener('submit', function(e) {
        const input = document.getElementById('classification_name');
        const value = input.value;
        const regex = /^[A-Za-z0-9]+$/;

        if (!regex.test(value)) {
            e.preventDefault();
            alert('Classification name can only contain letters and numbers (no spaces or special characters).');
        }
    });
} else {
    console.log("classificationForm not found on this page.");
};


//Client-Side Validation Script for update form
const updateForm = document.querySelector("#updateForm");
if (updateForm) {
    updateForm.addEventListener("change", function () {
        const updateBtn = document.querySelector("#updateVehicleBtn");
        if (updateBtn) {
            updateBtn.removeAttribute("disabled");
        } else {
            console.error("Update button not found!");
        }
    });
} else {
    console.log("updateForm not found on this page.");
};


// Client-Side Validation Script for inventory form
const inventoryForm = document.getElementById('inventoryForm');
if (inventoryForm) {
    inventoryForm.addEventListener('submit', function(e) {
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
} else {
    console.log("inventoryForm not found on this page.");
};


// Client-Side Validation Script for update inventory form
const updateFormValidation = document.getElementById('updateForm');
if (updateFormValidation) {
    updateFormValidation.addEventListener('submit', function(e) {
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
} else {
    console.log("updateForm for validation not found on this page.");
};



// Client-Side Validation for Delete Classification Form
const deleteClassificationForm = document.getElementById('deleteClassificationForm');
if (deleteClassificationForm) {
    deleteClassificationForm.addEventListener('submit', function(e) {
        const confirmDelete = confirm('Are you sure you want to delete this classification? This action cannot be undone.');
        if (!confirmDelete) {
            e.preventDefault();
        }
    });
} else {
    console.log("deleteClassificationForm not found on this page.");
};