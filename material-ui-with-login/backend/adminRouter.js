import express from 'express';
import { get, update, find, Q, remove } from '@reshuffle/db';
import { validateAdminRole } from './middleware';
const uuidv4 = require('uuid/v4');

const router = express.Router();

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

async function checkIfUserHasRole(userId, role) {
	const userRoles = (await get(`${rolesPrefix}${userId}`)) || makeDefaultRole();
	if (userRoles[role] !== true) {
		return false;
	}

	return true;
}

async function getVotesByMeeting(id) {
	try {
		const meetingQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(`${votingPrefix}${id}`))),
		);

		if (meetingQuery.length < 1) {
			return [];
		}

		const meeting = meetingQuery.map(({ value }) => value);

		return meeting;
	} catch (err) {
		console.log(err);
	}
};

async function addRoleToUser(id, role) {
	await update(`${rolesPrefix}${id}`, (roles = makeDefaultRole()) => {
		return {
			...roles,
			[role]: true,
		};
	});
}

async function removeRoleToUser(id, role) {
	await update(`${rolesPrefix}${id}`, (roles = makeDefaultRole()) => {
		return {
			...roles,
			[role]: false,
		};
	});
}

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

router.get('/add/angelrole/user/:id', validateAdminRole, async (req, res) => {
	try {
		if (await checkIfUserHasRole(req.params.id, [Roles.ANGEL])) {
			await removeRoleToUser(req.params.id, Roles.ANGEL);
			return res.status(200).json({ msg: 'Role removed.' })
		}

		await addRoleToUser(req.params.id, Roles.ANGEL);
		return res.status(200).json({ msg: 'Role added.' })
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
})

router.get('/add/adminrole/user/:id', validateAdminRole, async (req, res) => {
	try {
		if (await checkIfUserHasRole(req.params.id, [Roles.ADMIN])) {
			await removeRoleToUser(req.params.id, Roles.ADMIN);
			return res.status(200).json({ msg: 'Role removed.' })
		}

		await addRoleToUser(req.params.id, Roles.ADMIN);
		return res.status(200).json({ msg: 'Role added.' })
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
})

router.get("/votes/meeting/:id", validateAdminRole, async (req, res) => {
	try {
		const { id } = req.params;
		const meetingQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(`${votingPrefix}${id}`))),
		);

		if (meetingQuery.length < 1) {
			return res.status(400).json({ msg: 'no votes for this meeting.' });
		}

		const meeting = meetingQuery.map(({ value }) => value);

		return res.status(200).json(meeting);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/totalpoints/meeting/:id', validateAdminRole, async (req, res) => {
	try {
		const votes = await getVotesByMeeting(req.params.id);

		const voteTotals = votes.reduce((aggr, curr) => {
			const copy = { ...aggr };
			const v = curr.votes;

			const gVote = v.groupVote.startup.id;

			if (copy[gVote]) {
				copy[gVote] += 1;
			} else {
				copy[gVote] = 1;
			}
			return copy;
		}, {});

		return res.status(200).json(voteTotals);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
})

router.get('/getroles/user/:id', validateAdminRole, async (req, res) => {
	try {
		const { id } = req.params;
		const usersRoles = await update(
			`${rolesPrefix}${id}`,
			(roles = makeDefaultRole()) => {
				return roles;
			},
		);

		return res.status(200).json(usersRoles);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
});

router.get('/archivedstartups', validateAdminRole, async (req, res) => {
	try {
		const rolesQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(rolesPrefix), Q.value.STARTUP.eq(true))),
		);

		const userIds = rolesQuery.map(({ key, value }) => {
			return key.slice(rolesPrefix.length, key.length);
		});

		if (userIds.length < 1) {
			return res.status(204).json({ msg: 'No archived startups.' });
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

		const filtered = startups.filter(startup => startup.archived);

		return res.status(200).json(filtered);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
});

router.get('/vettedstartups', validateAdminRole, async (req, res) => {
	try {
		const rolesQuery = await find(
			Q.filter(Q.all(Q.key.startsWith(rolesPrefix), Q.value.STARTUP.eq(true))),
		);

		const userIds = rolesQuery.map(({ key, value }) => {
			return key.slice(rolesPrefix.length, key.length);
		});

		if (userIds.length < 1) {
			return res.status(204).json({ msg: 'No archived startups.' });
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

		const filtered = startups.filter(startup => !startup.archived && startup.vetted);

		return res.status(200).json(filtered);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' })
	}
});

router.put('/updatemeeting/:id', validateAdminRole, async (req, res) => {
	try {
		const { title, startups, date } = req.body.data;
		const { id } = req.params;
		const updatedMeeting = await update(`${meetingPrefix}${id}`, meetingToUpdate => {
			if (!meetingToUpdate) {
				throw new Error('User does not exist');
			}
			const copy = { ...meetingToUpdate };
			copy.title = title;
			copy.date = date;
			copy.startups = startups;

			return copy;
		});

		return res.status(200).json(updatedMeeting)

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.delete('/deletemeeting/:id', validateAdminRole, async (req, res) => {
	try {
		const { id } = req.params;
		await remove(`${meetingPrefix}${id}`, startupToRemove => {
			if (!startupToRemove) {
				throw new Error('Meeting does not exist');
			}
			return startupToRemove;
		});

		return res.status(202).json('Meeting deleted');

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/archivestartup/:id', validateAdminRole, async (req, res) => {
	try {
		const { id } = req.params;
		await update(`${startupsPrefix}${id}`, startupToUpdate => {
			if (!startupToUpdate) {
				throw new Error('User does not exist');
			}
			const copy = { ...startupToUpdate };

			if (startupToUpdate.archived) {
				copy.archived = false;
			} else {
				copy.archived = true;
			}
			return copy;
		});

		return res.status(200).json({ msg: 'Archived Startup.' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.delete('/deletestartup/:id', validateAdminRole, async (res, req) => {
	try {
		const { id } = req.params;
		await remove(`${startupsPrefix}${id}`, startupToRemove => {
			if (!startupToRemove) {
				throw new Error('Startup does not exist');
			}
			return startupToRemove;
		});

		return res.status(200).json({ msg: 'Startup deleted' });

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/vettstartup/:id', validateAdminRole, async (req, res) => {
	try {
		const { id } = req.params;
		await update(`${startupsPrefix}${id}`, startupToUpdate => {
			if (!startupToUpdate) {
				throw new Error('Startup does not exist');
			}
			const copy = { ...startupToUpdate };

			if (startupToUpdate.vetted) {
				copy.vetted = false;
			} else {
				copy.vetted = true;
			}

			return copy;
		});

		return res.status(200).json({ msg: 'Startup vetted.' });

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.post('/createmeeting', validateAdminRole, async (req, res) => {
	try {
		const meetingId = uuidv4();
		const { startups, date, title } = req.body.data;
		const createdMeeting = await update(
			`${meetingPrefix}${meetingId}`,
			meeting => {
				return {
					id: meetingId,
					title: title,
					date: date,
					startups: startups,
				};
			},
		);

		return res.status(200).json(createdMeeting);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/angel/:id', validateAdminRole, async (req, res) => {
	try {
		const angels = await getAngels();

		const filtered = angels.filter(angel => angel.id === req.params.id);

		return res.status(200).json(filtered);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

router.get('/createinvite', validateAdminRole, async (req, res) => {
	try {
		const inviteCode = uuidv4();

		const addInvite = await update(`${invitesPrefix}${inviteCode}`, invite => {
			if (invite) {
				return invite;
			}
			return {
				id: req.user.id,
				value: inviteCode,
				consumed: false,
				consumedBy: '',
			};
		});

		return res.status(200).json(addInvite);

	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Server Error.' });
	}
});

export default router;
