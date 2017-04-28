CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products (
item_id INT(100) AUTO_INCREMENT NOT NULL,
product_name VARCHAR (500) NOT NULL,
department_name VARCHAR (50),
price INT(30) NOT NULL,
stock_quantity INT(50) NOT NULL,
PRIMARY KEY (item_id)
);
USE bamazon_db;
CREATE TABLE departments (
department_id INT(100) AUTO_INCREMENT NOT NULL,
department_name VARCHAR (50),
totalsales INT(30) ,
overheadcosts INT(50),
PRIMARY KEY (department_id)
);

USE bamazon_db;
ALTER TABLE products
ADD product_sales INT(60);

