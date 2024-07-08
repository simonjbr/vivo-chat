import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const connectToMongoDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.log('Error connecting to MongoDB', error.message);
	}
};

mongoose.connect(process.env.MONGODB_URI);

export default connectToMongoDb;
