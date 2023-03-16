//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const https = require('https');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	console.log(firstName, lastName, email);

	var data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);
	const url = 'https://us21.api.mailchimp.com/3.0/lists/a753f08fd7';
	var options = {
		method: 'POST',
		auth: 'kaedot1:bffe53ad848c7d13f2e228404f604bd2-us21',
	};
	const request = https.request(url, options, (response) => {
		const httpStatus = response.statusCode;
		if (httpStatus == 200) {
			res.sendFile(__dirname + '/success.html');
		} else {
			res.sendFile(__dirname + '/failure.html');
		}

		//response.on('data', (data) => {
		//console.log(JSON.parse(jsonData));
		//});
	});
	request.write(jsonData);
	request.end();
});

app.post('/failure', (req, res) => {
	res.redirect('/');
});
app.listen(process.env.PORT || 3000, (req, res) => {
	console.log('Serving is running on port 3000 ');
});

// api key
// bffe53ad848c7d13f2e228404f604bd2-us21
//audience id
//a753f08fd7
