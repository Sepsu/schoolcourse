console.log('I am alive!');


import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import io from "socket.io-client"
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import remoteActionMiddleware from "./redux/middleware"
import reducer, {setState} from "./redux/sensors"
import {appContainer, homeContainer} from "./containers";

require('./stylesheets/app.scss');
require ("font-awesome/scss/font-awesome.scss");

const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state => {
	 console.log("State saapui serveriltä");
	 console.log(state);
	 store.dispatch(setState(state))
	}
);

const createStoreWithMiddleware = applyMiddleware(
	remoteActionMiddleware(socket))(createStore);


const store = createStoreWithMiddleware(reducer);
store.dispatch(setState({
	 
		loaded : false,
		loading : true,
		data : {
			labels:  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Sep', 'Test'],
			data: [10, 10, 10, 10, 10, null, null, 10, 10]
	}
}
	));



const routes = <Route component={appContainer}>
      <Route path="/" component={homeContainer} info="testing info"/>
    </Route>;

ReactDOM.render((
	<Provider store={store}>
<Router>{routes}</Router>
</Provider>),
     document.getElementById('app')
);

window.onbeforeunload = closingCode;
function closingCode(){
   console.log("calling exit code");
   console.log("socket", socket.id);
   socket.emit("disconnect");
   socket.disconnect();
   return null;
}