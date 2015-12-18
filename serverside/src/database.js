//Database imports
import mongo from "mongodb"
import monk from "monk"

import {store} from "../index"

//General
import assert from "assert"
import Promise from "promise"

var local_state = {
	db : null,
	user : null,
};


export function initDB() {
  	return new Promise((resolve,reject) => {
  		let dbName = "elospacesdb.cloudapp.net/test";
  		let db = monk(dbName);
		if (!db) {
			reject('Failed to connect');
		} else {
			if (! local_state.db){					
				 local_state.db = db;
			}
			resolve("connected to the database");
		}
	});
  }


export function getDB() {
	
  	return  local_state.db
  }

export function closeDB() {
	
  	if ( local_state.db){
  		 local_state.db.close((err,result) => { local_state.db = null;});
  		 //Set Connected: NULL
  	}
  }

export function connectDB(user, password){
	//Set redux store.state -> connected :true
	//Set redux store.state with user+password
	//Set user if the password is correct.
	return new Promise((resolve,reject) => {
	//if (!local_state.user){
		console.log("setting new db connection");
		let db = getDB();
		//for testing purposes lets connect to db if it not connected
		if (!db){
			initDB().then(() => {
			store.dispatch({type : "CONNECT", user : user, password : password});
			reject(new Error("Had to reconnected to the database"));
		});
		}
		else{
		let coll = db.get('elospaces');

		coll.find({"user.name" : user, "user.password" : password}).complete((err,doc) => {
		if (err) { 
			console.log("error while connecting");	
			reject("Error while connecting", err);
		}
		else {
			
			
			if (doc.length){
				console.log("connection success");			
				let temp = doc[0];
				let sensors = [];
				for (var key of Object.keys(temp.data)){
					sensors.push(key);
				}
		
				local_state.user = temp._id;
				let user = { name : temp.user.name, age : temp.user.age};
				resolve({sensors :sensors, user : user});	
			}
			
			reject(new Error("User not found..."));
		}			
		});
		//}
	//else 
	//	reject(new Error("Already connected to the server"));
}
	});

}

export function getData(val, sensor=true){
	return new Promise((resolve,reject) => {
		let db = getDB();
		let coll = db.get('elospaces');
		//console.log("objectia luodaan");
		//Object has to be created to be able to use the field param. for the key value.
		//let item = new Object;
		//item["data."+field] = "data."+val;

		if (!local_state.user){
			
			reject(new Error("Connect first to the database..."));
		}
		if (!val){
			reject(new Error("Missing loading parameter..."));
		}
		
		console.log("Fetching data");		
		let v = "data."+val;
		
		console.log("with query: ", v);
		//Find with the connected user + the parameters
		coll.find({"_id" : local_state.user}, v).complete((err,doc) => {
		if (err) { 			
			reject(new Error("error during data fetch", err));
		}
		else {
			if (doc.length){
				console.log("Data fetch success...");
				console.log(doc);
				resolve(parseData(doc[0]["data"][val], sensor));
			}
			else{
				reject(new Error("something went wrong"));
			}
		}			
	});
	});
	

}

//parse the data for the chart depending on sensor type and field name
function parseData(doc, sensor) {
	console.log("Parsing the data...");
	//console.log(doc);
	if (!sensor){
	
		return doc;

	}
	let data = {labels : [], data : []};
	for (var x of doc){
		data.labels.push(x.ts);
		data.data.push(x.values[0]);
	}
	//console.log(data);
	console.log("The data is parsed, returning...");
	return data;
	
		

}