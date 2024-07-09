import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		avatar: {
			type: String,
			default: '',
		},
		friends: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

// hash password pre save
userSchema.pre('save', async function (next) {
	if (this.isNew || this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	next();
});

const User = mongoose.model('User', userSchema);

export default User;
