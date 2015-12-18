import {createStore} from 'redux';
import reducer from './reducer';
import promiseMiddleware from "redux-promise-middleware";
import {applyMiddleware} from "redux"

export default function makeStore() {
const composeStoreWithMiddleware = applyMiddleware(
  promiseMiddleware()
)(createStore);
  return composeStoreWithMiddleware(reducer);
}