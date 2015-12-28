import {createStore} from 'redux';
import reducer from './reducer';
import promiseMiddleware from "redux-promise-middleware";
import {applyMiddleware} from "redux"

//Promise middleware is not in use at the moment
export default function makeStore() {
const composeStoreWithMiddleware = applyMiddleware(
  promiseMiddleware()
)(createStore);
  return composeStoreWithMiddleware(reducer);
}