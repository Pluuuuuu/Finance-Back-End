/*Modify SQLite Table to Enforce Date Restriction*/
ALTER TABLE fixed_expenses ADD CHECK (date_time <= CURRENT_TIMESTAMP);
ALTER TABLE fixed_incomes ADD CHECK (date_time <= CURRENT_TIMESTAMP);
