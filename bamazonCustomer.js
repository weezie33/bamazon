const mysql = require("mysql");
const inquirer = require("inquirer");
const columnify = require("columnify");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "ECho2345",
  database: "bamazonDB"
});


const fx = {
  displayItems: function() {
    connection.query("select * from products", (err, res) => {
      if (err) throw err;
      console.log(
        columnify(res, {
          columns: [
            "item_id",
            "product_name",
            "department_name",
            "price",
            "stock_quantity"
          ],
          config: {
            product_name: {
              headingTransform: function(heading) {
                heading = `Product Name------`;
                return heading;
              }
            },
            item_id: {
              headingTransform: function(heading) {
                heading = `Item #------`;
                return heading;
              }
            },
            department_name: {
              headingTransform: function(heading) {
                heading = `Department------`;
                return heading;
              }
            },
            stock_quantity: {
              headingTransform: function(heading) {
                heading = `# in Stock------`;
                return heading;
              }
            },
            price: {
              headingTransform: function(heading) {
                heading = `Price------`;
                return heading;
              },
              dataTransform: function(data) {
                data = `$${data}`;
                return data;
              }
            }
          },
          columnSplitter: "|",
          align: "center"
        })
      );
        // connection.end();
    });
  },
  init: function() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Type product ID or type 'Q' to exit",
          name: "buy_id"
        }
      ])
      .then(id_answer => {
        console.log(id_answer.buy_id);
        if (id_answer.buy_id === "Q" || id_answer.buy_id === "q") {
          console.log("Have a great day, buddy!");
          connection.end();
        } else {
          inquirer
            .prompt([
              {
                type: "input",
                message: "How much would you like?",
                name: "buy_quantity"
              }
            ])
            .then(quantity_answer => {
              console.log(quantity_answer.buy_quantity);
              connection.query(
                "SELECT stock_quantity FROM products WHERE ?",
                {
                  item_id: id_answer.buy_id
                },
                (err, resChecked) => {
                  if (err) throw err;
                  if (resChecked[0].stock_quantity > quantity_answer.buy_quantity) {
                    connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                        {
                          stock_quantity:
                            resChecked[0].stock_quantity - quantity_answer.buy_quantity
                        },
                        { item_id: id_answer.buy_id }
                      ],
                      (err, res) => {
                        if (err) throw err;
                        console.log("Great purchase!");
                        inquirer
                          .prompt([
                            {
                              name: "confirm",
                              message: "Want some more?",
                              type: "confirm",
                              default: "true"
                            }
                          ])
                          .then(answer => {
                            if (answer.confirm) {
                              fx.displayItems();
                              setTimeout(() => {
                                fx.init();
                              }, 100);
                            } else {
                              connection.end();
                            }
                          });
                      }
                    );
                  } else {
                    console.log(
                      "Sorry, insufficient stock. Check back later: )"
                    );
                    inquirer
                      .prompt([
                        {
                          name: "confirm",
                          message: "Try again?",
                          type: "confirm",
                          default: "true"
                        }
                      ])
                      .then(answer => {
                        if (answer.confirm) {
                          fx.displayItems();
                          setTimeout(() => {
                            fx.init();
                          }, 100);
                        } else {
                          connection.end();
                        }
                      });
                  }
                }
              );
            });
        }
      });
  }
};

connection.connect(err => {
  if (err) throw err;
  console.log(`
Come Buy at the Bamazon Market!
Time visited: ${connection.threadId}`);
  fx.displayItems();
  setTimeout(() => {
    fx.init();
  }, 100);
});