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
                    name: "menuOptions",
                    type: "list",
                    choices: ["View Product Sales by Department", "Create New Department"],
                    message: "Menu Options:"
                }
            ])
            .then(function (answer) {
                switch (answer.menuOptions) {
                    case "View Product Sales by Department":
                        console.log("\nProduct Sales by Department\n");
                        console.log("");
                        timer();
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
                                    function (err, res) {
                                        console.log("\n" + res.affectedRows + " Department created!\n");
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