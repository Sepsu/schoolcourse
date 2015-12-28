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
    connectUser(action.user, action.password); //Async
    return {connecting : true};

  //Take the parameter to load
  case "LOAD":
    loadData(action.val); //Async
    if (action.connected){
      return {connected : action.connected, loading : true,
       sensors : action.sensors, user : action.user};
    }
    //Tell to client that data is being loaded
  	return {loading : true};
  
  //Disconnect the user
  case "DISCONNECT":
  	console.log("Server is closing db");
  	closeDB();
  	return {connected : false, connecting : false, loading : false, 
      user : {name : null, age : null}};
  
  //Return error
  case "FAILURE":
   console.log("FAILURE");  
    return {error : action.error, loading : false, loaded : false};
  
  //Return the data
  case "SUCCESS":
    console.log("SUCCESS");	
    return {data : action.data, loading : false, loaded : true};

  //default  
  console.log("Server is returning null state");  
  return state;
}
}




export function connectUser(user, password) {
    console.log("Server is connecting db");
    connectDB(action.user, action.password).then((param) => {
      //After async connection and load initial data
      let sens = param.sensors;
      let user = param.user;
      if (sens.length){
          store.dispatch({
            type: "LOAD", 
            val : sens[0], 
            connected : true, 
            sensors : sens,
            user : user
           });
      }       
    },
    (err) => {
      //Tell the client about connection error
      console.log(err);
      store.dispatch({type: "FAILURE", error: err});
    });
}

export function loadData(val){
  console.log("Server is loading from db");
  getData(val).then((data) => {
    //After async load, send data to client     
    store.dispatch({type: "SUCCESS" , data});
    },
    (err) => {
      //Tell the client about loading error
      console.log(err);
      store.dispatch({type: "FAILURE", error: err});
    });
}