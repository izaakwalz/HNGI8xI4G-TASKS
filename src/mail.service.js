const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const Oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);

Oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

class MailService {
	constructor() {
		this.accessToken = Oauth2Client.getAccessToken();
		this.transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: process.env.CLIENT_MAIL,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: this.accessToken,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		this.outputSend = (data) => `
<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>  
  <li>Name: ${data.name}</li>
  <li>Email: ${data.email}</li>
</ul>
<h3>Message</h3>
<p>${data.message}</p>
`;

		this.outputReceive = (data) => `
<h2>Hello ${data.name},</h2>
<p>Just want to let you know that i have recived your message. Will get back to you soon 😀</p>
`;
	}

	async notificationMail(data) {
		await this.transport.sendMail({
			from: `WALZDEV <info@hngi8xi4g.com>`,
			to: data.email,
			subject: 'HELLO FROM WALZDEV',
			text: `Hello ${data.name}, Just want to let you know that i have recived your message. Will get back to you soon 😀`,
			html: this.outputReceive(data) ?? null,
		});
	}

	async receiveeMail(data) {
		await this.transport.sendMail({
			from: `WALZ_DEV-CV <support@walzdev.com>`,
			to: process.env.MY_MAIL,
			subject: `${data.subject.toUpperCase()}` ?? 'CV-RESPONSE',
			text: 'Hello world?',
			html: this.outputSend(data) ?? null,
		});
	}
}

module.exports = new MailService();

// console.log(process.env.MAIL_PASS);
