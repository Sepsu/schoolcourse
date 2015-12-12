import {Map} from 'immutable';

const LOAD = 'LOAD';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_FAIL = 'LOAD_FAIL';



export default function reducer(state = Map(), action) {
  switch (action.type) {
    case "SET_STATE":
      console.log("set-statessa");
      return state.merge(state,action.state);
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

export function setState(state){
  return {
   type: 'SET_STATE',
    state
  };
}



export function load(param,val) {
    return {
      meta: {remote: true},
      type: "LOAD",
      param: param,
      val: val   
    };
}


