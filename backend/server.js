const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const path = require('path');
const cors = require('cors');
const { insertReservation, showReservations } = require('./db');
const sendMail = require('./mail');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5001;

const CREDENTIALS = path.resolve('./dialogflow-key.json');
const PROJECT_ID = process.env.PROJECT_ID;

app.post('/dialogflow', async (req, res) => {
	const sessionClient = new SessionsClient({ keyFilename: CREDENTIALS });
	const sessionPath = sessionClient.projectAgentSessionPath(
		PROJECT_ID,
		req.body.sessionId
	);

	const request = {
		session: sessionPath,
		queryInput: {
			text: {
				text: req.body.query,
				languageCode: 'pl',
			},
		},
	};
	let data = {
		date: '',
		time: '',
		name: '',
		number: '',
	};
	try {
		const responses = await sessionClient.detectIntent(request);
		const result = responses[0].queryResult;
		if (
			result.allRequiredParamsPresent &&
			result.intent.displayName === 'TableReservationIntent'
		) {
			const param = result.parameters;
			const date = new Date(param.fields['reservation_date'].stringValue);
			const time = new Date(param.fields['reservation_time'].stringValue)
				.toISOString()
				.substring(11, 16);

			data = {
				date: `${date.getDate().toString().padStart(2, '0')}.${(
					date.getMonth() + 1
				)
					.toString()
					.padStart(2, '0')}`,
				time: time,
				name: param.fields['last-name'].stringValue,
				number: param.fields['number-integer'].numberValue,
				email: param.fields['email'].stringValue,
			};
			const id = await insertReservation(data);

			await sendMail(data, id?.rows[0]?.id);
			res.json({
				response: `Dziękujemy! Zarezerwowałem stolik na 
                ${data.number} osoby, dnia ${data.date} o 
                godzinie ${data.time} na nazwisko ${data.name}.`,
			});
		} else if (
			result.allRequiredParamsPresent &&
			result.intent.displayName === 'ShowReservationsIntent'
		) {
			const param = result.parameters;

			const last_name = param?.fields['last-name']?.stringValue;

			const data = await showReservations(last_name);
			if (data.length === 0) {
				res.json({
					response: `Nie ma zadnych rezerwacji na nazwisko ${last_name}:()`,
				});
			} else {
				res.json({
					response: `Znalazłem rezerwacje!`,
				});
			}
		} else {
			res.json({ response: result.fulfillmentText });
		}
	} catch (error) {
		console.error('Dialogflow API error:', error);
		res.status(500).send('Error communicating with Dialogflow.');
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
