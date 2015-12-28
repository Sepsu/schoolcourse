import Promise from "promise"
import monk from "monk"

import {store} from "../index"




export var local_state = {
	db : null,
	users : [],
};


export function initDB(dbName) {
  	return new Promise((resolve,reject) => {
  		let db = monk(dbName);
		if (!db) {
			reject(new Error('Failed to connect'));
		} else {
			if (!local_state.db){					
				 local_state.db = db;
			}
			resolve("connected to the database");
		}
	});
  }


export function getDB() {
	
  	return  local_state.db
  }

export function closeDB(socket_id) {
	return new Promise((resolve) =>{
  	if (local_state.db){
  		if (local_state.users.lenght >= 1){
  			let i = findId(socket_id,"sid");
  			local_state.users.splice(i,1);
  			return resolve("user disconnected");
  		}
  		else{
  			local_state.db.close((err,result) => { 
  		 	local_state.db = null; local_state.users = [];
  		 	resolve("disconnected");
  		 });
  		}
  	}
  	resolve("nothing to disconnect");
  	});
  }



export function connectDB(user, password, socket_id){
	
	return new Promise((resolve,reject) => {
		console.log("setting new db connection");
		let db = getDB();
		//for testing purposes lets connect to db if it not connected
		if (!db){
			initDB("elospacesdb.cloudapp.net/test").then(() => {
			store.dispatch({type : "CONNECT", user : user, password : password});
			return reject(new Error("Had to reconnected to the database"));
		});
		}
		else{
		//Get the right collection and find the user
		let coll = db.get('elospaces');
		coll.find({"user.name" : user, "user.password" : password}).complete((err,doc) => {
			if (err) { 
				console.log("error while connecting");	
				return reject("Error while connecting", err);
			}
			else {				
				if (doc.length){
								
					let temp = doc[0];
					let res = findId(temp._id,"id");			
					if (res !== -1){
						return reject(new Error("This user has already connected to the server"));
					}
					console.log("connection success");
					let sensors = [];
					for (var key of Object.keys(temp.data)){
						sensors.push(key);
					}
			
					local_state.users.push({ id : temp._id, user : temp.user.name, sid : socket_id});
					let user = { name : temp.user.name, age : temp.user.age};
					resolve({sensors :sensors, user : user});	
				}
				
				reject(new Error("User not found or invalid password..."));
			}			
		});
	}
	});

}

export function getData(val, socket_id ,sensor=true){
	return new Promise((resolve,reject) => {
		let db = getDB();
		let coll = db.get('elospaces');
		let i = findId(socket_id,"sid");
		if (user === -1){			
			return reject(new Error("Connect first to the database..."));
		}
		if (!val){
			return reject(new Error("Missing loading parameter..."));
		}
				
		let v = "data."+val;
		console.log("Fetching data with query: ", v);
		//Find with the connected user and receive only the queried fields the parameters
		coll.find({"_id" : user.id}, v).complete((err,doc) => {
		if (err) { 			
			reject(new Error("error during data fetch", err));
		}
		else {
			if (doc.length){
				console.log("Data fetch success...");
				resolve(parseData(doc[0]["data"][val], sensor));
			}
			else{
				reject(new Error("something went wrong"));
			}
		}			
	});
	});
	

}

function findId(a,b){
	let i = -1;
	for (var x of local_state.users){
		i++;
		if (x[b] === a)
			return i;
	}
	return i;
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