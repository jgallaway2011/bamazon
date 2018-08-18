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
                    name: "choice",
                    type: "list",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                    message: "Menu Options:"
                }
            ])
            .then(function (answer) {
                connection.query(
                    "SELECT * FROM products", function (error, results) {
                        if (error) throw err;

                        switch (answer.choice) {
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
                                console.log("Add to Inventory");
                                timer();
                                break;
                            case "Add New Product":
                                console.log("Add New Product");
                                timer();
                                break;
                        }
                    });

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