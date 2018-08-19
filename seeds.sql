/* Seeds for SQL table. */
USE boston;

/* Insert 10 Rows into products table */
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shirts", "Clothing", 10.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pants", "Clothing", 25.00, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shoes", "Clothing", 50.00, 77);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("TVs", "Electronics", 1000.00, 29);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue-Ray Players", "Electronics", 100.00, 41);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pans", "Home Goods", 30.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pots", "Home Goods", 29.99, 99);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Grocery", 4.00, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Eggs", "Grocery", 5.00, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("6-pack Chicken Breast", "Grocery", 30.00, 305);


/* Insert 4 Rows into departments table */
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Clothing", 1000.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 1000.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Home Goods", 1000.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Grocery", 1000.00);