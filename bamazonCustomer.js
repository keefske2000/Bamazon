var mysql = require('mysql');
var inquirer = require('inquirer');
var dbConfig = require('./config.js');
require('console.table');

var connection = mysql.createConnection({
	host: dbConfig.host,
	port: dbConfig.port,
	user: dbConfig.user,
	password: dbConfig.password,
	database: "bamazon_db"
});

// Create connection to database
connection.connect(function(err) {
	if (err) throw err;
	console.log ("Connected!", connection.threadId);
	// Call function to display all current products
	displayAll();
	
});

function displayTable (res) {
	var tableArray = [];
	for (var i = 0; i < res.length; i++) {
		// Push on object with product properties to tableArray for each result
		tableArray.push({
			"Product ID": res[i].id,
			"Product Name": res[i].product_name,
			"Department": res[i].department_name,
			"Price": "$" + res[i].price,
			"Quantity": res[i].stock_quanity,
		});
	}
	console.table(tableArray);
}

function displayAll () {
	connection.query('SELECT * FROM `products`', function (err, res) {
		if (err) throw err;
		displayTable(res);
		buyPrompt();
	});
}

function buyPrompt () {
	inquirer.prompt([{
		name: "id",
		message: 'Enter the ID of the product you want to buy.'
	}, {
		name: "quanity",
		message: 'What quantity would you like to buy?'
	}]).then(function(answer) {
		connection.query('SELECT * FROM `products` WHERE ?', {
			id: answer.id
		}, function (err, res) {
			if (err) throw err;
			var dbName = res[0].product_name;
			var dbQuantity = res[0].stock_quanity;
			var total = res[0].price * answer.quanity;
			// Check if enough items in stock to complete sale
			if (answer.quanity <= dbQuantity) {
				// Update quantity of product in database
				var newQuantity = dbQuantity - answer.quanity;
				connection.query("UPDATE `products` SET ? WHERE ?", [{
						stock_quanity: newQuantity
					}, {
            id: answer.id
            
					}], function(err, res) {
						if (err) throw err;
						// Confirmation of complete sale
						inquirer.prompt([{
							name: "return",
							message: "Purchase complete!\nid: " + dbName + "\nQuantity: " + answer.quanity + "\nTotal: $" + total,
							type: "list",
							choices: ["Return"]
						}]).then(function(answer) {
							displayAll();
						});
					}
				);
			} else {
				inquirer.prompt([{
					name: "error",
					message: 'Can not complete this quantity at this time!',
					type: "list",
					choices: ["Return"]
				}]).then(function(answer) {
					displayAll();
				});
			}
		});
	});
}