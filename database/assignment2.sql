--Query 1: for adding new user
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Query 2: for modifying account_type
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

--Query 3: for Deleting the Tony Stark record
DELETE FROM account
WHERE account_id = 1;

--Query 4: for Modifing the "GM Hummer" record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 5;

--Query 5: using join
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--Query 6: for Updating all records in the inventory table
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

