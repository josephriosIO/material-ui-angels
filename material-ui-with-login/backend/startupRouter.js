import express from 'express';
import { get, update, find, Q } from '@reshuffle/db';
import { validateRole, makeDefaultRole, addRoleToUser } from './middleware';

const router = express.Router();

const usersPrefix = 'users__';
const startupsPrefix = 'startups__';
const rolesPrefix = 'roles__';

const Roles = {
	ADMIN: 'ADMIN',
	ANGEL: 'ANGEL',
	STARTUP: 'STARTUP',
	GUEST: 'GUEST',
};

router.get('/createOrGetStartup', async (req, res) => {
	try {
		const addStartup = await update(`${startupsPrefix}${req.user.id}`, startup => {
			addRoleToUser(req.user.id, Roles.STARTUP);
			if (startup) {
				return startup;
			}
			return {
				id: req.user.id,
				name: req.user.displayName,
				img: req.user.picture,
				email: req.user.emails,
				phoneNumber: null,
				missionStatement: '',
				location: '',
				website: '',
				companyName: '',
				companySize: 0,
				completed: false,
				funded: false,
				archived: false,
				vetted: false,
				registered: Date.now(),
			};
		});

		return res.status(200).json(addStartup);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.put('/update', async (req, res) => {
	try {
		const {
			companyName,
			location,
			website,
			missionStatement,
			companySize,
		} = req.body.form;
		const data = await update(`${startupsPrefix}${req.user.id}`, startupToUpdate => {
			if (!startupToUpdate) {
				throw new Error('User does not exist');
			}
			const copy = { ...startupToUpdate };
			copy.companyName = companyName;
			copy.location = location;
			copy.website = website;
			copy.missionStatement = missionStatement;
			copy.companySize = companySize;
			copy.completed = true;

			return copy;
		});


		return res.status(200).json(data);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

export default router;