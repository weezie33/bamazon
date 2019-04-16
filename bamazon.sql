DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity DECIMAL(10,2) NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yoyo", "Toys", 10.5, 5340), ("Puzzle", "Toys", 35.23, 3050), ("Barbie", "Toys", 24.12, 1000), ("Ken Doll", "Toys", 23.23, 200), ("Bop It", "Toys", 50.2, 150), ("T-Shirts", "Clothes", 20.2, 100), ("Underwear", "Clothes", 5.99, 100), ("Socks", "Clothes", 4.99, 200), ("Hats", "Clothes", 20.00, 50), ("Boots", "Footwear", 100.5, 25);

SELECT * FROM products;
