
import makeStore from './src/store';
import startServer from './src/server';

export const store = makeStore();
store.dispatch(
{ type: 'SET_STATE',
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
	}
	);
startServer(store);