import dotenv from 'dotenv';
dotenv.config();

const connectionString =
	process.env.NODE_ENV === 'development'
		? 'mongodb://127.0.0.1:27017/vivoChat'
		: process.env.MONGODB_URI;

export default connectionString;
