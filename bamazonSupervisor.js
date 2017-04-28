//Calling dependencies
var mysql=require("mysql");
var inquirer=require("inquirer");
require('console.table');

//Creating global variables to use in multiple functions
var sql;
var innerjoin;
var top;

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
	console.log("Welcome Bamazon Supervisor!");
	console.log("");
	console.log("");
//Invoking function to display manager menu
	supermenu();
});


//Function to ask manager where to go
function supermenu(){
	inquirer.prompt([
		{	type: 'list',
			name: 'superselect',
			message: "Select an action.",
			choices: ["View Product Sales by Department", "Create New Department", "Exit system"]
		}]).then(function(supsel) {
				var selection=supsel.superselect;
				console.log(selection);
				switch(selection) {
					case "View Product Sales by Department":
						salesreview();
					break;
					case "Create New Department":
						newdepartment();
					break;
					case "Exit system":
						process.exit();
					break;
				}
				});
};

//Function to view profit margin
function salesreview() {
	innerjoin="SELECT DISTINCT bamazon_db.departments.department_id, bamazon_db.departments.department_name, IFNULL(COUNT(bamazon_db.products.department_name),0) AS numberofitems, IFNULL(bamazon_db.departments.overheadcosts,0) AS totalcost, IFNULL(SUM(bamazon_db.products.product_sales),0) AS totalsales, IFNULL(SUM(bamazon_db.products.product_sales),0)-IFNULL(bamazon_db.departments.overheadcosts,0) AS totalprofit FROM bamazon_db.departments LEFT JOIN bamazon_db.products ON bamazon_db.departments.department_name = bamazon_db.products.department_name GROUP BY bamazon_db.departments.department_name ORDER BY bamazon_db.departments.department_id;";
	connection.query(innerjoin, function(err, res) {
		if(err) throw err;
		console.table(res);
		supermenu();
	});
}

//Function to add a new department
function newdepartment() {
	sql= "SELECT department_id AS id, department_name AS NAME FROM departments";
	connection.query(sql, function(err, res) {
		if(err) throw err;
		console.log("");
		console.log("");
		console.table(res);
		console.log("");
		console.log("");
		inquirer.prompt([
		{	type: 'input',
			name: 'newdept',
			message: "What is the name of the new department?",
		},
		{	type: 'input',
			name: 'newoverhead',
			message: "What is the operating cost?",
			validate:validnumber
		}]).then(function(deptsel) {
				var deptname=deptsel.newdept;
				var overhead=parseInt(deptsel.newoverhead);
				console.log(overhead);
				console.log(deptname);
				connection.query("INSERT INTO departments SET ?", [
				{department_name: deptname, 
				overheadcosts: overhead}], 
				function(err, res) {});
				salesreview();
			});
	});
}


//validate number of items to buy is number
function validnumber(param){
	number=param;
	var isValid = !isNaN(parseFloat(number));
   return isValid || "Please enter a number";
}

