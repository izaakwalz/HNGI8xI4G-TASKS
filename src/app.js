const express = require('express');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const mailService = require('./mail.service');
dotenv.config();

const app = express();

app.use(express.json({ extended: false }));

app.use('/', express.static('src/public'));

app.post(
	'/send',
	asyncHandler(async (req, res) => {
		if (req.body) {
			await mailService.notificationMail(req.body);

			await mailService.receiveeMail(req.body);

			return res.json({ success: true, message: 'mail sent' });
		} else {
			res.status(400);
			new Error('One or more fields is missing');
		}
	})
);

app.use('/not-found', (req, res) => {
	res.send('APPLICATION IS RUNNING 🚨 🚨 🚨');
});

// error middlewares
app.all('*', (req, res, next) => {
	const error = new Error(`Resource not found -> can not ${req.method} request to ${req.originalUrl}`);
	res.status(404);
	next(error);
});

app.use((err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`:-:-:> Server runing in ${process.env.NODE_ENV} mode on port :> ${PORT}`);
});
