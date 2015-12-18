
//Server imports
import Server from 'socket.io';
import Promise from "promise"

//Own imports
import {initDB} from "./database"


export default function startServer(store) {

	 const io = new Server().attach(8090);	
  initDB().then(() => { 
    console.log("Server is running");
    
     store.subscribe(
    () => {console.log("emitting answer");
    let ans =  store.getState();
    //console.log(ans);
    io.emit('state', ans);}
    );

  io.on('connection', (socket) => {
    console.log("Server got new connection:");
    socket.emit('state', store.getState());
    socket.on('action', store.dispatch.bind(store));
  });

  

  });
}

