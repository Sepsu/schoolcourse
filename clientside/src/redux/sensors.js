import {Map} from 'immutable';

const LOAD = 'LOAD';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_FAIL = 'LOAD_FAIL';


function setState(state, newState){
  console.log("setting the state");
  return state.merge(newState);
}

export default function reducer(state = Map(), action) {
  switch (action.type) {
    case "SET_STATE":
      return setState(state,action.state);
    case LOAD:
      console.log("in load");
      return state.set(action.param, action.val);
    
//below cases not implemented
    case LOAD_SUCCESS:   
    case LOAD_FAIL:
    default:
      return state;
  }
}


export function load(param,val) {
    return {
      type: "LOAD",
      param: param,
      val: val   
    };
}


