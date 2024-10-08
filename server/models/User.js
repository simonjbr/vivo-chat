import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
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

// method to test entered password against hashed password
userSchema.methods.isCorrectPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
