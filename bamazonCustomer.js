var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

  function start() {
    inquirer
      .prompt({
        name: "ID",
        type: "rawlist",
        message: "Whats your product ID number",
        choices: ["1 soap", "2 tissue", "3 socks", "4 juice", "5 soil", "6 strawberries", "7 birthday cards", "8 pizza", "9 boots", "10 computer"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.ID.toUpperCase() === "1 soap", "2 tissue", "3 socks", "4 juice", "5 soil", "6 strawberries", "7 birthday cards", "8 pizza", "9 boots", "10 computer") {
          postAuction();
        }
        else {
          bidAuction();
        }
      });
  }
  
  // function to handle posting new items up for auction
  function postAuction() {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "How many items would like to purchase?"
        ,
        // {
        //   name: "price",
        //   type: "input",
        //   message: "How much are you willing to pay?"
        // },
        // {
        //   // name: "stock_quanity",
        //   // type: "input",
        //   // message: "We have that item available at this time?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
              
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.category,
            price: answer.startingBid,
            stock_quanity: answer.startingBid
          },
          function(err) {
            if (err) throw err;
            console.log("Your purchase was successfull!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      });
  }
  
  function bidAuction() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].stock_quanity);
              }
              return choiceArray;
            },
            message: "What auction would you like to place a bid in?"
          },
          {
            name: "bid",
            type: "input",
            message: "How much would you like to bid?"
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].item_name === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          // determine if bid was high enough
          if (chosenItem.department_name < parseInt(answer.bid)) {
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quanity: answer.startingBid
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Purchase placed successfully!");
                start();
              }
            );
          }
          else {
            // bid wasn't high enough, so apologize and start over
            console.log("Your bid was too low. Try again...");
            start();
          }
        });
    });
  }
  
  