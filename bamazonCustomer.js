// VARIABLES************************************************************************************************************
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
const Joi = require('joi');


// create the connection information for the sql database
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
var totalCost;
var productSales;
var seconds = 5;
var intervalId;

// MAIN PROCESS************************************************************************************************************

// connect to the mysql server and sql database
connection.connect(function (error) {
    if (error) throw error;
    // run the start function after the connection is made to prompt the user
    start();
});

// FUNCTIONS************************************************************************************************************
function start() {
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;
        console.log("\nAvailable for Sale\n");
        var table = new Table({
            head: ["ITEM #", "PRODUCT", "PRICE ($)"]
        });
        for (i = 0; i < results.length; i++) {
            table.push([results[i].item_id, results[i].product_name, "$" + parseFloat(results[i].price,2)]); 
        }
        console.log(table.toString());
        console.log("");
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
                    totalCost = answer.quantity * results[answer.choice - 1].price;
                    productSales = totalCost + results[answer.choice - 1].product_sales;
                    console.log("\nPurchase Successful!\n" +
                        "Total Cost: $" + totalCost +
                        " (" + answer.quantity + " x $" + results[answer.choice - 1].price + ")"
                    );

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity,
                                product_sales: productSales
                            }, {
                                item_id: answer.choice
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            timer();
                        }
                    );
                } else {
                    console.log("\nInsufficient quantity!");
                    timer();
                }
            });
    });
}

function onValidation(error, val) {
    if (error) {
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