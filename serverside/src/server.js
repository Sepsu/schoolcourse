
//Server imports
import http from "http";
import Express from 'express'
import sio from 'socket.io';
import Promise from "promise"

//Own imports
import {initDB, getDB, closeDB } from "./database"


export default function startServer() {

	
	const app = new Express();
	const server = new http.Server(app);
	server.listen(8001);	
  	//const io = new sio().listen(server);
  	
  	initDB().then(() => {
  			
  			let database = getDB();
  			let collection = database.get('elotesti');
  			collection.find({"username" : "testuser1"}).complete((err,doc) => {
  			if (err) throw err;			
  			console.log(doc)
  			closeDB();
  		});

});
    	
  
  	console.log("Server is listening at port %s",  server.address().port);


}

