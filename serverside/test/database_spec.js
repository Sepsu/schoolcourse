import {expect} from 'chai';
import {initDB, getDB, closeDB, getData, connectDB, local_state} from '../src/database';

describe('database logic', () => {

  // ..

  describe('initDB', () => {

  	it("connects to a database server or throws an error", () => {
  		expect(local_state).to.deep.equal({db : null, user : null});

  		initDB("aafadfdsf").then((err) => {
  			expect(err).to.equal(new Error('Failed to connect'));
  		});
  		
  		initDB("elospacesdb.cloudapp.net/test").then(() => {
  			expect(local_state).not.to.deep.equal({db : null});
  		});

  	});
});

  describe('getDB', () => {
  	it("returns the database instance", () => {
  		expect(getDB()).to.equal(local_state.db);
  	});
  });


describe('connectDB', () => {

  	it("connects a specific user to the database", () => {
  		expect(local_state.user).to.equal(null);
	
  		connectDB("Nakki", "joo").then(() => {
  			expect(local_state.user).to.equal("56129c9c74fece05a9b30eaa");
  		});

  	});
  		it("Throws an error because user is already connected", () => {
	
  		connectDB("Nakki", "joo").then((err) => {
  			expect(err).to.equal(new Error("Already connected to the server"));
  		});

  	});
		it("Does not find the user and throws an error", () => {

		closeDB().then(() => {
  		connectDB("asdasd", "asdasdas").then((err) => {
  			expect(err).to.equal(new Error("User not found or invalid password..."));
  		});
  		});

  	});
});

describe('getData', () => {

  	it("get specific data from the database", () => {
	
  		getData("temp").then((doc) => {
  			expect(doc).to.have.property("data");
  		});

  	});
		it("Throws an error because parameter is missing", () => {
	
  		getData().then((err) => {
  			expect(err).to.equal(new Error("Missing loading parameter..."));
  		});

  	});

  		it("Throws an error because user is not connected", () => {
		closeDB().then(() => {
  		getData("temp").then((err) => {
  			expect(err).to.equal(new Error("Connect first to the database..."));
  		});
  		});

  	});
});



  describe('closeDB', () => {
  	it("Does not do anything if there is no connection",()=>{
  		const db = getDB();
  		closeDB().then(() => {
  		expect(getDB()).to.deep.equal(db);
  		});
  	});
  	it("Disconnects the database", () => {
  		connectDB("Nakki", "joo").then(() =>{
  		closeDB().then(() => {
  		expect(getDB()).to.deep.equal({db : null, user : null});
  		});
  	});
  	});
  	
  });




});