var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
const Joi = require('joi');

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
connection.connect(function (error) {
    if (error) throw error;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;
        inquirer
            .prompt([
                {
                    name: "menuOptions",
                    type: "list",
                    choices: ["View Product Sales by Department", "Create New Department"],
                    message: "Menu Options:"
                }
            ])
            .then(function (answer) {
                switch (answer.menuOptions) {
                    case "View Product Sales by Department":
                        var sql = "SELECT departments.department_id AS ID, departments.department_name AS NAME, departments.over_head_costs AS EXPENSES, products.product_sales AS REVENUES FROM products JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_name";
                        connection.query(sql, function (error, results) {
                            if (error) throw error;
                            console.log("\nProduct Sales by Department\n");
                            var table = new Table({
                                head: ["ID", "NAME", "EXPENSES", "REVENUES", "PROFIT"]
                            });
                            for (i = 0; i < results.length; i++) {
                                var profit = results[i].REVENUES - results[i].EXPENSES;
                                table.push([results[i].ID, results[i].NAME, "$" + results[i].EXPENSES, "$" + results[i].REVENUES, "$" + profit]);
                            }
                            console.log(table.toString());
                            console.log("");
                            timer();
                        });
                        break;
                    case "Create New Department":
                        inquirer
                            .prompt([
                                {
                                    name: "department_name",
                                    type: "input",
                                    message: "Name of new department?"
                                }, {
                                    name: "over_head_costs",
                                    type: "input",
                                    validate: validatePositiveNumber,
                                    message: "Overhead costs?"
                                }
                            ])
                            .then(function (answer) {
                                connection.query(
                                    "INSERT INTO departments SET ?",
                                    {
                                        department_name: answer.department_name,
                                        over_head_costs: answer.over_head_costs
                                    },
                                    function (error, results) {
                                        console.log("\n" + results.affectedRows + " Department created!\n");
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

function onValidation(error, val) {
    if (error) {
        return error.message;
    }
    else {
        return true;
    }

}

function validatePositiveNumber(quantity) {
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