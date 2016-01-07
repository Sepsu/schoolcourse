import {Map} from "immutable"
import {store} from "../index"

import {initDB, getDB, closeDB, getData, connectDB} from "./database"

export default function reducer(state = Map(), action) {
  switch (action.type) {
  case 'SET_STATE':
  	console.log("Server is setting state");
    return state.merge(state, action.state);
  //not used

  
  //Connect the user
  case "CONNECT":
    connectUser(action.user, action.password, action.socket); //Async
    return {socket : action.socket,connecting : true};

  //Take the parameter to load
  case "LOAD":
    loadData(action.val, action.socket); //Async
    //Tell to client that data is being loaded
  	return {socket : action.socket, loading : true};
  
  //Disconnect the user
  case "DISCONNECT":
  	console.log("Server is closing db");
  	closeDB(action.socket.id);
  	return {socket : action.socket,connected : false, connecting : false, loading : false, 
      user : {name : null, age : null}};
  
  //Return error
  case "LOAD_FAILURE":
   console.log("LOADING FAILURE");
    return { socket : action.socket,error : action.error.toString(), loading : false, loaded : false};
  
  //Return error
  case "CONNECT_FAILURE":
   console.log("CONNECTION FAILURE");
   return {socket : action.socket, error : action.error.toString() ,connected : false, connecting : false, loading : false}
  
  //Return the data
  case "LOAD_SUCCESS":
    console.log("SUCCESS");	
    return {data : action.data, socket : action.socket, error : false, loading : false, loaded : true};
   //Return the data
  case "CONNECT_SUCCESS":
    console.log("SUCCESS"); 
    return {socket : action.socket, error : false, connected : true, connecting : false, loading : true,
       sensors : action.sensors, user : action.user};
  //default  
  console.log("Server is returning null state");  
  return state;
}
}




export function connectUser(user, password, socket) {
    connectDB(user, password, socket).then((param) => {
      //After async connection and load initial data
      let sens = param.sensors;
      let user = param.user;
      if (sens.length){
          store.dispatch({
            type : "CONNECT_SUCCESS",
            sensors : sens,
            user : user,
            socket
          });
          store.dispatch({
            type: "LOAD", 
            val : sens[0],  
            sensors : sens,
            socket
           });
      }       
    },
    (err) => {
      //Tell the client about connection error
      console.log(err);
      store.dispatch({type: "CONNECT_FAILURE", error: err, socket});
    });
}

export function loadData(val,socket){
  console.log("Server is loading from db");
  getData(val,socket.id).then((data) => {
    //After async load, send data to client     
    store.dispatch({type: "LOAD_SUCCESS" , data, socket});
    },
    (err) => {
      //Tell the client about loading error
      console.log(err);
      store.dispatch({type: "LOAD_FAILURE", error: err, socket});
    });
}