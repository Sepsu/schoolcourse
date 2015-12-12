
//Server imports
import Server from 'socket.io';
import Promise from "promise"

//Own imports
//import {initDB, getDB, closeDB, getData } from "./database"


export default function startServer(store) {

	 const io = new Server().attach(8090);	
  
     store.subscribe(
    () => io.emit('state', store.getState())
    );

  io.on('connection', (socket) => {
    socket.emit('state', store.getState());
    socket.on('action', store.dispatch.bind(store));
  });










  /*	
  	initDB().then(() => {  		
  		      getData("user.name", "Nakki").then((data) =>{
            console.log("data returned:");
            console.log(data);
            closeDB();

        }); 			
  		});
*/
  	

    	
  
  	console.log("Server is running");


}

