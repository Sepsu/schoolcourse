import {Map} from 'immutable';


export default function reducer(state = Map(), action) {
  switch (action.type) {
    case "SET_STATE":
      console.log("Setting state");
      return state.merge(state,action.state);
    //Set local state to "loading", nothing else
    case "CONNECT":
      console.log("connecting");
      return state;
    case "LOAD":
      console.log("loadissa");
      return state;
  
    default:
      return state;
  }
}

export function setState(state){
  return {
   type: 'SET_STATE',
    state
  };
}

export function load(val) {
  console.log("calling load action");
    return {
      meta: {remote: true},
      type: "LOAD",
      val: val 
    };
}

export function connect(user,password) {
    return {
      meta: {remote: true},
      type: "CONNECT",
      user: user,
      password: password   
    };
}

export function disconnect(){
console.log("disconnecting");
return {
      meta: {remote: true},
      type: "DISCONNECT"   
    };

}
