/* Schema for SQL database/table. */
DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

/* Create new table with a primary key that auto-increments, and columns */
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (item_id)
);

/* Create new table with a primary key that auto-increments, and columns */
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10,2),
  PRIMARY KEY (department_id)
);