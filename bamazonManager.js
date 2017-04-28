//Calling dependencies
var mysql=require("mysql");
var inquirer=require("inquirer");
require('console.table');

//Creating global variables to use in multiple functions
var sql;
var top;
var itemname;
var itemamount;
var itemcost;
var itemdesc;

//Calling database
var connection= mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Learn2day!",
	database: "bamazon_db",
});

//Calling database and intro to app
connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id "+connection.threadId);
	console.log("");
	console.log("");
	console.log("");
	console.log("Welcome Bamazon Manager!");
	console.log("");
	console.log("");
//Invoking function to display manager menu
	managermenu();
});


//Function to ask manager where to go
function managermenu(){
	inquirer.prompt([
		{	type: 'list',
			name: 'managerselect',
			message: "Select an action.",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit system"]
		}]).then(function(mansel) {
				var selection=mansel.managerselect;
				console.log(selection);
				switch(selection) {
					case "View Products for Sale":
						viewproducts();
					break;
					case "View Low Inventory":
						limitproducts();
					break;
					case "Add to Inventory":
						addstock();
					break;
					case "Add New Product":
						newitem();
					break;
					case "Exit system":
						process.exit();
					break;
				}
				});
};

//Function to view products for sale
function viewproducts() {
	sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity  FROM products";
	connection.query(sql, function(err, res) {
		if(err) throw err;
		console.log("");
		console.log("");
		console.table(res);
//Invoking function to call manager menu
		console.log("");
		console.log("");
		managermenu();
	});
}

//Function to view products with low inventory
function limitproducts() {
		inquirer.prompt([
		{	type: 'input',
			name: 'lowamount',
			message: "Display items where the quanity is fewer than what number? Enter number.",
			validate:validnumber
		}]).then(function(itemsel) {
				var amount=parseInt(itemsel.lowamount);
				console.log(amount);
				sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity FROM products WHERE stock_quantity < " + amount;
				connection.query(sql, function(err, res) {
						if(err) throw err;
						console.log("");
						console.log("");
						console.log("Items with " + amount + " units or less.")
						console.log("");
						console.table(res);
						console.log("");
						console.log("");
//Invoking function to call manager menu
						managermenu();
				});
			});
}

//Function to update quantity to a specific item
function addstock(){
	sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity  FROM products";
	connection.query(sql, function(err, res) {
		if(err) throw err;
		console.log("");
		console.log("");
		console.table(res);
		console.log("");
		console.log("");
		inquirer.prompt([
		{	type: 'input',
			name: 'itemselect',
			message: "Which item do you wish to add stock? Please write in item number",
			validate:validitem
		}]).then(function(itemsel) {
				var item=parseInt(itemsel.itemselect);
				inquirer.prompt([
					{	type: 'input',
						name: 'quant',
						message: "How many units are you adding?",
						validate:validnumber
					}]).then(function(itemcount) {
							sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity  FROM products WHERE ?";							
							connection.query(sql,{item_id: item} ,function(err, itable) {
								if(err) throw err;
								var quant=parseInt(itemcount.quant);
								var newquant=itable[0].Quantity+quant;
								connection.query("UPDATE products SET ? WHERE ?", [
								{stock_quantity: newquant}, 
								{item_id: item}], 
								function(err, res) {});
								console.log("");
								console.log("");
								console.log("The new quantity for " + itable[0].Item + " is " + newquant);	
								viewproducts();
							});
						});
			});
	});
};

//Function to add item to inventory list
function newitem(){
	inquirer.prompt([
		{	type: 'input',
			name: 'itemname',
			message: "Please provide name of item.",
		},
		{	type: 'input',
			name: 'itemamount',
			message: "Please provide the number of units for item.",
			validate:validnumber
		},
		{	type: 'input',
			name: 'itemcost',
			message: "Please provide the price of 1 unit.",
			validate:validnumber
		},
		{	type: 'list',
			name: 'itemdesc',
			message: "Please select the best category for this item.",
			choices:["equipment", "leisure", "personal", "sports", "toys", "misc"]
		}]).then(function(res) {
				itemname=res.itemname;
				itemamount=parseInt(res.itemamount);
				itemcost=parseInt(res.itemcost);
				itemdesc=res.itemdesc;
				console.log(itemname);
				var rowitems={
				  product_name: itemname,
				  stock_quantity: itemamount,
				  price: itemcost,
				  department_name:itemdesc
				};
				connection.query('INSERT INTO products SET ?',rowitems, function(res) {});
				viewproducts();
		});
}


//VALIDATION functions
//Function to count maximum id number
function maxid(){
	sql= "SELECT MAX(item_id) AS top FROM products ";
	connection.query(sql, function(err, res) {
		top=res[0].top;
	});
}


//validate itemnumber is input and is a number within a table
function validitem(param){
//Invoking function to set top id variable
	maxid();
	number=param;
	var isValid = !isNaN(parseFloat(number)) && number<=top;
    return isValid || "Please enter a valid item number!";
}

//validate number of items to buy is number
function validnumber(param){
	number=param;
	var isValid = !isNaN(parseFloat(number));
   return isValid || "Please enter a number";
}

