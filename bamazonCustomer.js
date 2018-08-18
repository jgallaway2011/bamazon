var mysql = require("mysql");
var inquirer = require("inquirer");
const Joi = require('joi');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 330,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

var newQuantity;

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("Available for Sale");
        for (i = 0; i < results.length; i++) {
            console.log("Item #: " + results[i].item_id +
                " | Product: " + results[i].product_name +
                " | Price: " + results[i].price);
        }

        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "input",
                    validate: validateChoice,
                    message: "What item # would you like to buy (type #)?"
                },
                {
                    name: "quantity",
                    type: "input",
                    validate: validateQuantity,
                    message: "Quantity?"
                }
            ])
            .then(function (answer) {
                if (answer.quantity < results[answer.choice - 1].stock_quantity) {
                    newQuantity = results[answer.choice - 1].stock_quantity - answer.quantity;
                    console.log(newQuantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                item_id: answer.choice
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            start();
                        }
                    );
                } else {
                    console.log("Insufficient quantity!");
                    start();
                }
            });
    });
}

function onValidation(err, val) {
    if (err) {
        return err.message;
    }
    else {
        return true;
    }

}

function validateChoice(choice) {
    var schema = Joi.number().required().min(0).max(10);
    return Joi.validate(choice, schema, onValidation);
}

function validateQuantity(quantity) {
    var schema = Joi.number().required().min(0)
    return Joi.validate(quantity, schema, onValidation);
}