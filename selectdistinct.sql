USE bamazon_db;
INSERT INTO departments (department_name)
SELECT DISTINCT department_name FROM products;