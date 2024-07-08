import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import connectToMongoDb from './config/connection.js';
import routes from './routes/index.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.listen(PORT, async () => {
	await connectToMongoDb();
	console.log(`Server listening at port: ${PORT}`);
});
