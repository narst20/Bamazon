//Calling dependencies
var mysql=require("mysql");
var inquirer=require("inquirer");
require('console.table');

//Creating global variables to use in multiple functions
var sql;
var top;
var profit=0;

//Calling database
var connection= mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Learn2day!",
	database: "bamazon_db",
});

//Function to run initial table during startup
function calltable (){
	sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity  FROM products";
	connection.query(sql, function(err, res) {
		if(err) throw err;
		console.table(res);
//Invoking function to call main menu
		maxid();
		menu();
	});

}

//Function to view table after purchase (with updates)
function viewtable (){
	sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity  FROM products";
	connection.query(sql, function(err, res) {

	//View updated t	if(err) throw err;able
		console.table(res);
		inquirer.prompt([
			{	type: 'confirm',
				name: 'nextpurchase',
				message: "Do you wish to make another purchase?",
				validate:validitem
			}]).then(function(itemsel) {
					if(itemsel.nextpurchase){
	//Invoking function to restart purchasing path
						calltable();
					}
					else{
	//Invoking function to exit program
						process.exit();
					}
				});
	});
}

//Function to ask what item to buy and how many
function menu(){
	inquirer.prompt([
		{	type: 'input',
			name: 'itemselect',
			message: "Which item do you want to buy? Please select item number",
			validate:validitem
		}]).then(function(itemsel) {
				var item=parseInt(itemsel.itemselect);
				inquirer.prompt([
					{	type: 'input',
						name: 'quant',
						message: "How many do you want to buy?",
						validate:validnumber
					}]).then(function(itemcount) {
						var count=parseInt(itemcount.quant);
	//Invoking function to see if purchase can be made				
						stockcheck(item,count);
					});
				});
};

//Function to update the table by purchasing item
function purchase(item, count){
	sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity, IFNULL(product_sales,0) AS Profit FROM products WHERE ?";
	connection.query(sql,{item_id: item} ,function(err, ptable) {
		if(err) throw err;
		console.table(ptable);
		var pay=count*ptable[0].Cost;
		//determin profit
		if (typeof(ptable[0].Profit)===null){
			profit=0;
			profit=profit+pay;
		}
		else{
			profit=ptable[0].Profit;
			profit=profit+pay;
			console.log(profit);
		}

		var newquant=ptable[0].Quantity-count;
		connection.query("UPDATE products SET ? WHERE ?", [
			{stock_quantity: newquant, product_sales: profit}, 
			{item_id: item}], 
			function(err, res) {});
		console.log("Thank you for your purchase. The total cost is $",pay);
//Invoking function to see updated table
		viewtable();
		});
}


////VALIDATION functions
//Function to count maximum id number
function maxid(){
	sql= "SELECT MAX(item_id) AS top FROM products ";
	connection.query(sql, function(err, res) {
		top=res[0].top;
	});
}

//validate itemnumber is input and is a number within a table
function validitem(param){
	number=param;
//Invoking function to set top id variable
	var isValid = !isNaN(parseFloat(number)) && number<=top;
    return isValid || "Please enter a valid item number!";
}

//validate number of items to buy is number
function validnumber(param){
	number=param;
	var isValid = !isNaN(parseFloat(number));
   return isValid || "Please enter a number";
}

//validate to see if there is sufficient stock for item
function stockcheck(item, count){
	sql= "SELECT item_id AS id, product_name AS Item, price AS Cost, stock_quantity AS Quantity  FROM products WHERE ?";
	connection.query(sql,{item_id: item} ,function(err, table) {
		if(err) throw err;
		if(count>table[0].Quantity){
			console.log("Cannot buy! Please review table again!");
//Invoking function to make purchase and update table
			calltable();
		}
		else{
			console.log("You are in luck!");
//Invoking function to make purchase and update table
			purchase(item,count);
		}

	});
}


//Calling database and intro to app
connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id "+connection.threadId);
	console.log("");
	console.log("");
	console.log("");
	console.log("");
	console.log("-------------------------------------------------------");
	console.log("");
	console.log("");
	console.log("Welcome to Bamazon!");
	console.log("");
	console.log("");
	console.log("Please view our products.");
});

//Invoking function to display table at start
calltable();