
import http from "http";
import Express from 'express'
import sio from 'socket.io';





export default function startServer() {

	
	const app = new Express();
	const server = new http.Server(app);
	server.listen(8001);	
  	//const io = new sio().listen(server);

  	console.log("Server is listening at port %s",  server.address().port);

  	app.get("/" , function(req, res){
  		res.send("Hello World!")
  	})
}

