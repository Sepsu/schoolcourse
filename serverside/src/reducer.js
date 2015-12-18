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
  	console.log("Server is connecting db");
  	connectDB(action.user, action.password).then((param) => {
      //After async connection and load initial data
      let sens = param.sensors;
      let user = param.user;
      if (sens.length){
        
          store.dispatch({type: "LOAD", val : sens[0], connected : true, sensors : sens, user : user});
      }  
          
    },
    (err) => {
      //Tell the client about connection error
      console.log(err);
      store.dispatch({type: "FAILURE", error: err});
    }
    );
  //Tell the client that connection is being made
  return {connecting : true};
  //Take the parameter to load
  case "LOAD":
  	console.log("Server is loading from db");
    getData(action.val).then((data) => {
      //After async load, send data to client     
      store.dispatch({type: "SUCCESS" , data});
    },
    (err) => {
      //Tell the client about loading error
      console.log(err);
      store.dispatch({type: "FAILURE", error: err});
    });
    if (action.connected){
      console.log("actionuser", action.user);
      return {connected : action.connected, loading : true, sensors : action.sensors, user : action.user};
    }
    //Tell to client that data is being loaded
  	return {loading : true};
  console.log("Server is returning null state");
  //Disconnect from database and update state according
  case "DISCONNECT":
  	console.log("Server is closing db");
  	closeDB();
  	return {connected : false, loading : false, user : {name : null, age : null}};
  //Return error and set loading/connecting states
  case "FAILURE":
    return {error : action.error, loading : false, loaded : false};
  //Return the data and update loading status
  case "SUCCESS":
    console.log("SUCCESS");	
    return {data : action.data, loading : false, loaded : true};
  console.log("Server is returning null state");  
  return state;
}
}




