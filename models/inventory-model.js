const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle by inventory ID
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0] // Return the first (and only) row
  } catch (error) {
    console.error("getVehicleById error " + error)
  }
}


/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0; // Return true if insertion was successful
  } catch (error) {
    console.error("addClassification error " + error);
    return false;
  }
}

/* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0; // Return true if classification exists
  } catch (error) {
    console.error("checkExistingClassification error " + error);
    return false;
  }
}




/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        classification_id, inv_make, inv_model, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const result = await pool.query(sql, [
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
    ]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("addInventory error " + error);
    return false;
  }
};


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
};


/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data.rowCount; // Returns 1 if successful, 0 if failed
  } catch (error) {
    console.error("Delete Inventory Error: " + error);
    return 0;
  }
};


/* *****************************
 * Get classification by ID for Delete
 * ***************************** */
async function getClassificationById(classification_id) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_id = $1";
    const result = await pool.query(sql, [classification_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getClassificationById error: " + error);
    return null;
  }
};

/* *****************************
 * Delete classification
 * ***************************** */
async function deleteClassification(classification_id) {
  try {
    const sql = "DELETE FROM public.classification WHERE classification_id = $1 RETURNING *";
    const result = await pool.query(sql, [classification_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("deleteClassification error: " + error);
    return false;
  }
};


/* *****************************
 * Update a classification
 * ***************************** */
async function updateClassification(classification_id, classification_name) {
  try {
    const sql = "UPDATE public.classification SET classification_name = $1 WHERE classification_id = $2 RETURNING *";
    const result = await pool.query(sql, [classification_name, classification_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updateClassification error: " + error);
    return null;
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  checkExistingClassification,
  addInventory,
  updateInventory,
  deleteInventoryItem,
  getClassificationById,
  deleteClassification,
  updateClassification,
};
