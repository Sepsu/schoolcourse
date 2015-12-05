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
  		let dbName = "localhost/elospaces";
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

