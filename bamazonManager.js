var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 330
    port: 330,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

var newQuantity;
var seconds = 5;
var intervalId;

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "menuOptions",
                    type: "list",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                    message: "Menu Options:"
                }
            ])
            .then(function (answer) {
                switch (answer.menuOptions) {
                    case "View Products for Sale":
                        console.log("\nProducts for Sale\n");
                        for (i = 0; i < results.length; i++) {
                            console.log("Item #: " + results[i].item_id +
                                " | Product: " + results[i].product_name +
                                " | Price: " + results[i].price);
                        }
                        console.log("");
                        timer();
                        break;
                    case "View Low Inventory":
                        console.log("\nProducts with Low Inventory\n");
                        for (i = 0; i < results.length; i++)
                            if (results[i].stock_quantity <= 5) {
                                console.log("Item #: " + results[i].item_id +
                                    " | Product: " + results[i].product_name +
                                    " | Stock Quantity: " + results[i].stock_quantity
                                );
                            }
                        console.log("");
                        timer();
                        break;
                    case "Add to Inventory":
                        console.log("");
                        inquirer
                            .prompt([
                                {
                                    name: "choice",
                                    type: "list",
                                    choices: function () {
                                        var choiceArray = [];
                                        for (var i = 0; i < results.length; i++) {
                                            choiceArray.push(results[i].item_id + "-" + results[i].product_name);
                                        }
                                        return choiceArray;
                                    },
                                    message: "Buy inventory of which item?"
                                }, {
                                    name: "quantityToBuy",
                                    type: "input",
                                    message: "How much to buy?"
                                }
                            ])
                            .then(function (answer) {
                                var index = parseInt(answer.choice.charAt(0)) -1;
                                newQuantity = parseInt(results[index].stock_quantity) + parseInt(answer.quantityToBuy);
                                console.log("\nUpdated Stock Quantity: " + newQuantity + " (" + results[index].stock_quantity + " + " + answer.quantityToBuy + ")\n");
                                connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [
                                        {
                                            stock_quantity: newQuantity
                                        },
                                        {
                                            product_name: answer.choice.substr(2)
                                        }
                                    ],
                                    function (error) {
                                        if (error) throw err;
                                        timer();
                                    }
                                );
                            });
                        break;
                    case "Add New Product":
                        console.log("Add New Product");
                        inquirer
                            .prompt([
                                {
                                    name: "product_name",
                                    type: "input",
                                    message: "Name of new product?"
                                }, {
                                    name: "department_name",
                                    type: "input",
                                    message: "Department Name of new product?"
                                }, {
                                    name: "price",
                                    type: "input",
                                    message: "Price of new product?"
                                }, {
                                    name: "stock_quantity",
                                    type: "input",
                                    message: "Stock Quantity of new product?"
                                }
                            ])
                            .then(function (answer) {
                                connection.query(
                                    "INSERT INTO products SET ?",
                                    {
                                        product_name: answer.product_name,
                                        department_name: answer.department_name,
                                        price: answer.price,
                                        stock_quantity: answer.stock_quantity
                                    },
                                    function (err, res) {
                                        console.log("\n" + res.affectedRows + " product inserted!\n");
                                        // Call updateProduct AFTER the INSERT completes
                                        timer();
                                    }

                                );
                            });

                        break;
                }
            });
    });
}

// Function to give five seconds with message before program starts over
function timer() {
    clearInterval(intervalId);
    intervalId = setInterval(decrement, 1000);
}

// The decrement function.
function decrement() {
    seconds--;
    if (seconds === 0) {
        stopDecrement();
        start();
        seconds = 5;
    }
}

// The stop function
function stopDecrement() {
    clearInterval(intervalId);
}