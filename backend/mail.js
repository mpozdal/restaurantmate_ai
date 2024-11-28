const nodemailer = require('nodemailer');
require('dotenv').config();
const { email_template, email_template_html } = require('./email_template');
const sendMail = async (data, id) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail', // Możesz użyć np. 'Outlook', 'Yahoo', lub skonfigurować SMTP ręcznie
		auth: {
			user: process.env.EMAIL, // Twój adres e-mail
			pass: process.env.EMAIL_PASS, // Hasło aplikacji (nie używaj hasła konta Google)
		},
	});

	const mailOptions = {
		from: process.env.EMAIL,
		to: data.email,
		subject: `Numer rezerwacji #${id}`,
		text: email_template(data),
		html: email_template_html(data),
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Błąd przy wysyłaniu e-maila:', error);
		} else {
			console.log('E-mail wysłany:', info.response);
		}
	});
};

module.exports = sendMail;
