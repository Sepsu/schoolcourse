import {Map} from "immutable"
import {store} from "../index"

import {initDB, getDB, closeDB, getData, connectDB} from "./database"

export default function reducer(state = Map(), action) {
  switch (action.type) {
  case 'SET_STATE':
  	console.log("Server is setting state");
    return state.merge(state, action.state);
  
  //Connect the user
  case "CONNECT":
    connectUser(action.user, action.password, action.socket); //Async
    return {socket : action.socket,connecting : true};

  //Take the parameter to load
  case "LOAD":
    loadData(action.val, action.socket); //Async
    if (action.connected){
      return {socket : action.socket,connected : action.connected, loading : true,
       sensors : action.sensors, user : action.user};
    }
    //Tell to client that data is being loaded
  	return {socket : action.socket, loading : true};
  
  //Disconnect the user
  case "DISCONNECT":
  	console.log("Server is closing db");
  	closeDB(action.socket.id);
  	return {socket : action.socket,connected : false, connecting : false, loading : false, 
      user : {name : null, age : null}};
  
  //Return error
  case "FAILURE":
   console.log("FAILURE");  
    return {error : action.error, socket : action.socket, loading : false, loaded : false};
  
  //Return the data
  case "SUCCESS":
    console.log("SUCCESS");	
    return {data : action.data, socket : action.socket, loading : false, loaded : true};

  //default  
  console.log("Server is returning null state");  
  return state;
}
}




export function connectUser(user, password, socket) {
    console.log("Server is connecting db");
    connectDB(user, password, socket.id).then((param) => {
      //After async connection and load initial data
      let sens = param.sensors;
      let user = param.user;
      if (sens.length){
          store.dispatch({
            type: "LOAD", 
            val : sens[0], 
            connected : true, 
            sensors : sens,
            user : user,
            socket
           });
      }       
    },
    (err) => {
      //Tell the client about connection error
      console.log(err);
      store.dispatch({type: "FAILURE", error: err, socket});
    });
}

export function loadData(val,socket){
  console.log("Server is loading from db");
  getData(val,socket.id).then((data) => {
    //After async load, send data to client     
    store.dispatch({type: "SUCCESS" , data, socket});
    },
    (err) => {
      //Tell the client about loading error
      console.log(err);
      store.dispatch({type: "FAILURE", error: err, socket});
    });
}