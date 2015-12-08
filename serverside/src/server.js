
//Server imports
import http from "http";
import Express from 'express'
import sio from 'socket.io';
import Promise from "promise"

//Own imports
import {initDB, getDB, closeDB, getData } from "./database"


export default function startServer() {

	
	const app = new Express();
	const server = new http.Server(app);
	server.listen(8001);	
  	//const io = new sio().listen(server);
  	
  	initDB().then(() => {  		
  		      getData("user.name", "Nakki").then((data) =>{
            console.log("data returned:");
            console.log(data);
            closeDB();

        }); 			
  		});

  	app.use((req, res) =>{



  	});


    	
  
  	console.log("Server is listening at port %s",  server.address().port);


}

