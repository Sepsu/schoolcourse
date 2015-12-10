console.log('I am alive!');


import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from "./redux/sensors"
import {App, homeContainer} from "./containers";

require('./stylesheets/app.scss');

const store = createStore(reducer);
//Example state, will come later from the server
store.dispatch({
	type: "SET_STATE",
	state : {
		user : {
			name : "Nakki",
			age : 22
		},
		loaded : false,
		loading : true,
		data : {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Sep', 'Test'],
			data: [19, 86, 27, 120, 120, null, null, 10, 10]
		}
	}
});
const routes = <Route component={App}>
      <Route path="/" component={homeContainer} info="testing info"/>
    </Route>;

ReactDOM.render((
	<Provider store={store}>
<Router>{routes}</Router>
</Provider>),
     document.getElementById('app')
);
