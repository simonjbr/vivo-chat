import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

// controller for /api/auth/signup
export const signup = async (req, res) => {
	try {
		const { username, email, password, confirmPassword, avatar } = req.body;

		// avatars generated with robohash.org/<username>?set=set<1-5>
	} catch (error) {}
};

// controller for /api/auth/login
export const login = async (req, res) => {
	console.log('login');
};

// controller for /api/auth/logout
export const logout = async (req, res) => {
	console.log('logout');
};
