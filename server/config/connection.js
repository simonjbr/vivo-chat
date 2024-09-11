import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const connectionString =
	process.env.NODE_ENV === 'development'
		? 'mongodb://127.0.0.1:27017/vivoChat'
		: process.env.MONGODB_URI;

setTimeout(() => {
	mongoose.connect(connectionString);
}, 100);

export default mongoose.connection;
