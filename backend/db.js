const { Client } = require('pg');
const config = require('./config');

const insertReservation = async (data) => {
	const client = new Client(config);

	try {
		// Połączenie z bazą danych
		await client.connect();

		// Zapytanie SQL do wstawienia danych
		const query = `
            INSERT INTO reservations (last_name, reservation_date, reservation_time, number_of_people)
            VALUES ($1, $2, $3, $4)
            RETURNING id; -- Zwraca ID nowo dodanego rekordu
        `;
		const values = [
			data.name,
			convertToDateFormat(data.date),
			data.time,
			data.number,
		];
		const id = await client.query(query, values);
		return id;
	} catch (err) {
		console.error('Błąd podczas dodawania rezerwacji:', err.message);
	} finally {
		await client.end();
	}
};

const showReservations = async (name) => {
	const client = new Client(config);

	try {
		await client.connect();
		const query = `
            SELECT * from reservations where last_name = $1 ORDER BY reservation_date, reservation_time;
        `;
		const values = [name];
		const result = await client.query(query, values);
		return result.rows;
	} catch (err) {
		console.error('Błąd podczas wyświetlania rezerwacji:', err.message);
	} finally {
		await client.end();
	}
};

function convertToDateFormat(date) {
	const [day, month] = date.split('.');
	const year = new Date().getFullYear(); // Bierzemy bieżący rok
	return `${year}-${month}-${day}`; // Formatujemy jako YYYY-MM-DD
}

module.exports = { insertReservation, showReservations };
