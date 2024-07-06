import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectToMongoDb from './config/connection.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
	await connectToMongoDb();
	console.log(`Server listening at port: ${PORT}`);
});
