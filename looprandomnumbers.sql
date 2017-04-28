USE bamazon_db;
SET SQL_SAFE_UPDATES = 0;
UPDATE departments 
SET overheadcosts=FLOOR(RAND()*(2500-1000+1))+1000 
WHERE ISNULL(overheadcosts);
SET SQL_SAFE_UPDATES = 1;