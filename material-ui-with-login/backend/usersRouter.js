import express from 'express';
import { get, update, find, Q } from '@reshuffle/db';
import { validateRole, makeDefaultRole, addRoleToUser } from './middleware';

const router = express.Router();

const { ADMIN_USER_EMAIL } = process.env;

const usersPrefix = 'users__';
const startupsPrefix = 'startups__';
const rolesPrefix = 'roles__';
const invitesPrefix = 'invites__';
const meetingPrefix = 'meeting__';
const votingPrefix = 'voting__';

const Roles = {
	ADMIN: 'ADMIN',
	ANGEL: 'ANGEL',
	STARTUP: 'STARTUP',
	GUEST: 'GUEST',
};



async function getAngels() {
	const rolesQuery = await find(
		Q.filter(Q.all(Q.key.startsWith(rolesPrefix), Q.value.ANGEL.eq(true))),
	);

	const userIds = rolesQuery.map(({ key, value }) => {
		return key.slice(rolesPrefix.length, key.length);
	});

	if (userIds.length < 1) {
		return [];
	}

	const usersQuery = await find(
		Q.filter(
			Q.any(
				...userIds.map(id => {
					return Q.key.startsWith(`${usersPrefix}${id}`);
				}),
			),
		),
	);

	return usersQuery.map(({ value }) => value);
}

router.get('/getroles', async (req, res) => {
	try {
		const usersRoles = await update(
			`${rolesPrefix}${req.user.id}`,
			(roles = makeDefaultRole()) => {
				return roles;
			},
		);

		return res.status(200).json(usersRoles);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error' });
	}
});

router.post('/canvote', validateRole, async (req, res) => {
	try {
		const meetingDate = new Date(req.body.date);
		const current = new Date();

		const bool = current.getTime() > meetingDate.getTime();

		return res.status(200).json(bool);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/getusers', validateRole, async (req, res) => {
	try {
		const rolesQuery = await find(Q.filter(Q.all(Q.key.startsWith(usersPrefix)), Q.value.STARTUP.eq(false)));
		const userIds = rolesQuery.map(({ key, value }) => {
			return key.slice(usersPrefix.length, key.length);
		});

		if (userIds.length < 1) {
			return res.status(204).json({ msg: 'empty array.' })
		}

		const usersQuery = await find(
			Q.filter(
				Q.any(
					...userIds.map(id => {
						return Q.key.startsWith(`${usersPrefix}${id}`);
					}),
				),
			),
		);
		const data = usersQuery.map(({ value }) => value);

		return res.status(200).json(data)

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/getangels', validateRole, async (req, res) => {
	try {
		const angels = await getAngels();

		return res.status(200).json(angels);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
});

router.get('/createOrGetUser', async (req, res) => {
	try {
		const addUser = await update(`${usersPrefix}${req.user.id}`, user => {
			if (req.user.emails[0].value === ADMIN_USER_EMAIL) {
				addRoleToUser(req.user.id, Roles.ADMIN);
			}

			if (user) {
				return user;
			}
			return {
				id: req.user.id,
				name: req.user.displayName,
				img: req.user.picture,
				email: req.user.emails,
				phoneNumber: null,
				bio: '',
				location: '',
				lastSeenStartup: null,
				editedProfile: false,
			};
		});

		return res.status(200).json(addUser);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.put('/updateuser/:id', async (req, res) => {
	try {
		const { name, location, phoneNumber, bio } = req.body.form;
		const data = await update(`${usersPrefix}${req.params.id}`, userToUpdate => {
			if (!userToUpdate) {
				throw new Error('User does not exist');
			}
			const copy = { ...userToUpdate };
			copy.name = name;
			copy.location = location;
			copy.phoneNumber = phoneNumber;
			copy.bio = bio;
			copy.editedProfile = true;

			return copy;
		});

		return res.status(200).json(data)

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
});

router.get('/allstartups', validateRole, async (req, res) => {
	try {
		const rolesQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(rolesPrefix), Q.value.STARTUP.eq(true))),
		);

		const userIds = rolesQuery.map(({ key, value }) => {
			return key.slice(rolesPrefix.length, key.length);
		});

		if (userIds.length < 1) {
			return res.status(204).json({ msg: 'no startups' });
		}

		const usersQuery = await find(
			Q.filter(
				Q.any(
					...userIds.map(id => {
						return Q.key.startsWith(`${startupsPrefix}${id}`);
					}),
				),
			),
		);
		const startups = usersQuery.map(({ value }) => value);

		const data = startups.filter(startup => !startup.archived);

		return res.status(200).json(data);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
});

router.get('/hasvoted:/id', validateRole, async (req, res) => {
	try {
		const voted = await get(`${votingPrefix}${req.params.id}${req.user.id}`);

		return res.status(200).json(voted);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: err })
	}
});

router.get('/getmeetings', validateRole, async (req, res) => {
	try {
		const rolesQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(meetingPrefix))),
		);
		const userIds = rolesQuery.map(({ key, value }) => {
			return key.slice(meetingPrefix.length, key.length);
		});

		if (userIds.length < 1) {
			return res.status(204).json({ msg: 'No Meetings' })
		}

		const usersQuery = await find(
			Q.filter(
				Q.any(
					...userIds.map(id => {
						return Q.key.startsWith(`${meetingPrefix}${id}`);
					}),
				),
			),
		);
		const data = usersQuery.map(({ value }) => value);

		return res.status(200).json(data);

	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.get('/getmeeting/:id', validateRole, async (req, res) => {
	try {
		const rolesQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(meetingPrefix))),
		);
		const userIds = rolesQuery.map(({ key, value }) => {
			return key.slice(meetingPrefix.length, key.length);
		});

		if (userIds.length < 1) {
			return res.status(204).json({ msg: 'no data' });
		}

		const usersQuery = await find(
			Q.filter(
				Q.any(
					...userIds.map(id => {
						return Q.key.startsWith(`${meetingPrefix}${id}`);
					}),
				),
			),
		);
		const data = usersQuery.filter(({ value }) => value.id === req.params.id);

		return res.status(200).json(data);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: err })
	}
});

router.post('/vote/meeting/:id', validateRole, async (req, res) => {
	try {

		const addVote = await update(
			`${votingPrefix}${req.params.id}${req.user.id}`,
			vote => {
				if (vote) {
					throw new Error('Already voted.');
				}
				return {
					id: req.user.id,
					votes: req.body.votes,
				};
			},
		);

		return res.status(200).json(addVote);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error' });
	}
});


export default router;