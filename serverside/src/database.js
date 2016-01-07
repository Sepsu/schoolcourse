import Promise from "promise"
import monk from "monk"

import {store} from "../index"

const DB = "localhost:27017/elospaces"
//const DB = "elospacesdb.cloudapp.net/test"


export var local_state = {
	db : null,
	users : [],
};


export function initDB() {
  	return new Promise((resolve,reject) => {
  		let db = monk(DB);
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
	console.log("socket_id is ", socket_id);
  	if (local_state.db){		
  		if (local_state.users.length >= 1){
  			let i = findId(socket_id,"sid");
  			if (i !== -1){
  				local_state.users.splice(i,1);
  				return resolve("user disconnected");
  			}
  			return resolve("Dummy client, nothing to disconnect");
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


// Allows multiple users from same socket? bug or is it even possible with unique sockets?
export function connectDB(user, password, socket){
	
	return new Promise((resolve,reject) => {
		const socket_id = socket.id;
		console.log("setting new db connection");
		let db = getDB();
		//for testing purposes lets connect to db if it not connected
		if (!db){
			initDB(DB).then(() => {
			store.dispatch({type : "CONNECT", user : user, password : password, socket : socket});
			return reject(new Error("Had to reconnected to the database, please wait!"));
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
					let tempId = temp._id.toString();
					let res = findId(tempId,"id");			
					if (res !== -1){
						return reject(new Error("This user has already connected to the server"));
					}
					console.log("connection success");
					let sensors = [];
					for (var key of Object.keys(temp.data)){
						sensors.push(key);
					}
			
					local_state.users.push({ id : tempId, user : temp.user.name, sid : socket_id});
					let user = { name : temp.user.name, age : temp.user.age};
					return resolve({sensors :sensors, user : user});	
				}
				
				reject(new Error("User not found or invalid password..."));
			}			
		});
	}
	});

}

export function getData(val, socket_id="0" ,sensor=true){
	return new Promise((resolve,reject) => {
		let db = getDB();
		let coll = db.get('elospaces');
		let i = findId(socket_id,"sid");
		if (i === -1){			
			return reject(new Error("Connect first to the database..."));
		}
		if (!val){
			return reject(new Error("Missing loading parameter..."));
		}
		let user = local_state.users[i];
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
//Find the index of value "a" from a list of objects with field "b"
function findId(a,b){
	let i = 0;
	for (var x of local_state.users){	
		if (x[b] === a){
			return i;
		}
		i++;
	}
	return -1;
}



//parse the data for the chart
function parseData(doc, sensor) {
	console.log("Parsing the data...");
	if (!sensor){
		return doc;
	}
	let data = {labels : [], data : []};
	//Currently loads only the first index of the data array, later should take parameter how much to load
	//Also the loop should be replaces with .map() to increase performace and this could be anynchrounously not to block the server
	for (var x of doc){
		data.labels.push(x.ts);
		data.data.push(x.values[0]);
	}
	console.log("The data is parsed, returning...");
	return data;
}