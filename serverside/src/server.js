
//Server imports
import Server from 'socket.io';
//Own imports
import {initDB} from "./database"


export default function startServer(store) {
  var connections = [];
  var active_socket = null;
  //Socket io is using port 8090
  const io = new Server().attach(8090);
  //Connect to database server on start	
  initDB("elospacesdb.cloudapp.net/test").then(() => { 
    console.log("Server is running");

    //Subscribe store to emit state changes to socket
    store.subscribe(() => {
      console.log("emitting answer");
      let ans =  store.getState();
      let soc = ans.socket;
      delete ans["socket"];
      if (soc){
      console.log("active socket ",soc.id);
      soc.emit('state',ans);
      }
    });
    //On new connection emit the current state and bind store to listen socket
    io.on('connection', (socket) => {
      console.log("Server got new connection:");
      connections.push(socket);
      socket.emit('state', store.getState());
      socket.on('action', (action) => {
        active_socket = socket;
        action.socket = socket;
        store.dispatch(action);
      });
      socket.on('disconnect', () => {
        let i = connections.indexOf(socket);
        connections.splice(i,1);
        console.log("Server lost a connection");
        store.dispatch({type : "DISCONNECT", socket: socket});

      });
  });  
  });
}

