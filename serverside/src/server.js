
//Server imports
import Server from 'socket.io';
//Own imports
import {initDB} from "./database"


export default function startServer(store) {
  //Socket io is using port 8090
  const io = new Server().attach(8090);
  //Connect to database server on start	
  initDB("elospacesdb.cloudapp.net/test").then(() => { 
    console.log("Server is running");

    //Subscribe store to emit state changes to socket
    store.subscribe(() => {
      console.log("emitting answer");
      let ans =  store.getState();
      io.emit('state', ans);}
    );
    //On new connection emit the current state and bind store to listen socket
    io.on('connection', (socket) => {
      console.log("Server got new connection:");
      socket.emit('state', store.getState());
      socket.on('action', store.dispatch.bind(store));
  });

  
  });
}

