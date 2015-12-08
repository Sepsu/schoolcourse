//Database imports
import mongo from "mongodb"
import monk from "monk"

//General
import assert from "assert"
import Promise from "promise"

var state = {
	db : null,
};


export function initDB() {
  	return new Promise((resolve,reject) => {
  		let dbName = "elospacesdb.cloudapp.net/test";
  		let db = monk(dbName);
		if (!db) {
			reject('Failed to connect');
		} else {
			if (!state.db){					
				state.db = db;
			}
			resolve("connected to the database");
		}
	});
  }


export function getDB() {
	
  	return state.db
  }

export function closeDB() {
	
  	if (state.db){
  		state.db.close((err,result) => {state.db = null;});
  	}
  }

export function getData(field, val, sensor=false){
	return new Promise((resolve,reject) => {
		let db = getDB();
		let coll = db.get('elospaces');
		//Object has to be created to be able to use the field param. for the key value.
		let item = new Object;
		item[field] = val;

		coll.find(item).complete((err,doc) => {
		if (err) { 
			console.log("error during data fetch");	
			reject("Data fetch failed");
		}
		else {
			console.log("data fetch success");
			resolve(parseData(doc, sensor));
		}			
	});
	});
	

}

//parse the data for the chart depending on sensor type and field name
function parseData(doc, sensor) {
	console.log("parsing");
	console.log(doc);
	if (!sensor){
		return doc;
	}

	return doc;
	
		

}