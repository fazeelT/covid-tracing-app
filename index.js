const cool = require('cool-ascii-faces');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var neo4j = require('neo4j-driver');

var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;
var db = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass), { encrypted: 'ENCRYPTION_ON'});

function createContactTrace(person1FName, person1LName, person2FName, person2LName, date, time, location) {
	var session = db.session();
	session.run("Merge (n1:Person {firstName: $person1FName, lastName: $person1LName}) " 
	+ "Merge (n2:Person {firstName: $person2FName, lastName: $person2LName}) " 
	+ "CREATE (n1)-[:MET {location: $location, date: $date, time: $time}]->(n2)", {person1FName, person1LName, person2FName, person2LName, location, date, time})
    .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record)
        });

        session.close();
    })
    .catch(function(error) {
        console.log(error);
    });
}


function searchContactTrace(contactFName, contactLName, date, time) {
	var session = db.session();
	return session.run("Match(person {firstName: $contactFName, lastName: $contactLName}) "
	+ "-[r:MET*1..5]-(p) where size([re IN r WHERE re.date > $date or "
	+ "( re.date = $date and re.time > $time)]) > 0 return DISTINCT p", {contactFName, contactLName, date, time})
    .then(function(result) {
    	console.log(result);

        session.close();
        return result.records;
    })
    .catch(function(error) {
        console.log(error);
        return [];
    });
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/search-contacts', (req, res) => res.render('pages/search-contacts'))
  .post('/ajax/submit-create-contact-trace', (req, res) => {
  	createContactTrace(req.body.formData.myFName.toLowerCase(), 
  		req.body.formData.myLName.toLowerCase(),
  		req.body.formData.contactFName.toLowerCase(),
  		req.body.formData.contactLName.toLowerCase(),  
  		req.body.formData.dateOfMeeting, 
  		req.body.formData.timeOfMeeting, 
  		req.body.formData.locationOfmeeting.toLowerCase())
  	res.send('success');
  })
  .post('/ajax/submit-search-contact-trace', (req, res) => {
  	var resultRecords = searchContactTrace(req.body.formData.contactFName.toLowerCase(),
  		req.body.formData.contactLName.toLowerCase(),  
  		req.body.formData.dateOfMeeting, 
  		req.body.formData.timeOfMeeting)

  	resultRecords.then(function(rs) {
  		res.send(rs);	
  	})
  	
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
