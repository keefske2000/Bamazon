var mysql = require('mysql');
var dbConfig = require('./config.js');

var connection = mysql.createConnection({
	host: dbConfig.host,
	port: dbConfig.port,
	user: dbConfig.user,
	password: dbConfig.password
});

connection.connect(function (err) {
	if (err) throw err;
	console.log('Connected!', connection.threadId);
});

connection.query('DROP DATABASE bamazon_db;', function (err, result) {
});

connection.query('CREATE DATABASE bamazon_db;', function (err, result) {
	if (err) throw err;
	console.log('Database created');
});

var table = 'CREATE TABLE bamazon_db.products (id INT AUTO_INCREMENT, product_name VARCHAR(200) NOT NULL, department_name VARCHAR(200), price DECIMAL(10, 2) NOT NULL, stock_quantity INT(10) NOT NULL, PRIMARY KEY (item_id ));';
connection.query(table, function (err, result) {
	if (err) throw err;
	console.log('Table created');
});

var insert = 'INSERT INTO bamazon_db.products ( "product_name", "department_name", "price", "stock_quantity" ) VALUES (1,"soap","Housing",2,100),(2,"tissue","Housing",7,100),(3,"socks","Clothing",10,100),(4,"juice","Food",3,100),(5,"soil","Planting",9,100),(6,"strawberries","Food",5,100),(7,"birthday cards","Arts and Craft",4,100),(8,"pizza","Food",10,100),(9,"boots","Clothing",200,100),(10,"computer","Technology",1000,100),'
connection.query(insert, function (err, result) {
	if (err) throw err;
	console.log('Data Seeded');
});

connection.end(function (err) {
	if (err) throw err;
});
