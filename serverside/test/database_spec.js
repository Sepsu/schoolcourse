import {expect} from 'chai';
import {initDB, getDB, closeDB, getData, connectDB, local_state} from '../src/database';

describe('database logic', () => {


  const socket1 = {id: "aaaa"};
  const socket2 = {id: "bbbb"};
  // ..

  describe('initDB', () => {

  	it("connects to a database server or throws an error", () => {
  		expect(local_state).to.deep.equal({db : null, users : []});

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

  	it("connects multiple users to the database", () => {
  		expect(local_state.users).to.deep.equal([]);
	
  		connectDB("Nakki", "joo",socket1).then(() => {
  			expect(local_state.users[0].id).to.equal("56129c9c74fece05a9b30eaa");
  		});
        connectDB("Testi", "joo",socket2).then(() => {
        expect(local_state.users[1].id).to.equal("56129c9c74fece05a9b30eac");
        closeDB(socket2.id).then(()=>{});
      });

  	});
  		it("Throws an error because user is already connected", () => {
	
  		connectDB("Nakki", "joo",socket1).then((err) => {
  			expect(err).to.equal(new Error("Already connected to the server"));
  		});

  	});
		it("Does not find the user and throws an error", () => {

		closeDB(socket1.id).then(() => {
  		connectDB("asdasd", "asdasdas",socket1).then((err) => {
  			expect(err).to.equal(new Error("User not found or invalid password..."));
  		});
  		});

  	});
});

describe('getData', () => {

  	it("get specific data from the database", () => {
	
  		getData("temp",socket1).then((doc) => {
  			expect(doc).to.have.property("data");
  		});

  	});
		it("Throws an error because parameter is missing", () => {
	
  		getData().then((err) => {
  			expect(err).to.equal(new Error("Missing loading parameter..."));
  		});

  	});

  		it("Throws an error because user is not connected (socket is wrong)", () => {
      getData("temp",socket2.id).then((err) => {
            expect(err).to.equal(new Error("Connect first to the database..."));
          });

    		closeDB(socket1.id).then(() => {
      		getData("temp",socket1.id).then((err) => {
      			expect(err).to.equal(new Error("Connect first to the database..."));
      		});
      		});

  	});
});



  describe('closeDB', () => {
  	it("Does not do anything if there is no connection",()=>{
  		const db = getDB();
  		closeDB(socket1.id).then(() => {
  		expect(getDB()).to.deep.equal(db);
  		});
  	});
  	it("Disconnects the database only if the provided socket is connected", () => {
  		connectDB("Nakki", "joo",socket2.id).then(() =>{

      const db = getDB();
      closeDB(socket1.id).then(() => {
      expect(getDB()).not.to.equal(db);
      });
  		closeDB().then(() => {
  		expect(getDB()).to.deep.equal({db : null, user : null});
  		});
      });
  	});
  	});
  	





});