import { get, update } from '@reshuffle/db';

const rolesPrefix = 'roles__';

const Roles = {
	ADMIN: 'ADMIN',
	ANGEL: 'ANGEL',
	STARTUP: 'STARTUP',
	GUEST: 'GUEST',
};

export const makeDefaultRole = () => {
	return Object.keys(Roles).reduce((aggr, curr) => {
		return {
			...aggr,
			[curr]: false,
		};
	}, {});
};

export async function addRoleToUser(id, role) {
	await update(`${rolesPrefix}${id}`, (roles = makeDefaultRole()) => {
		return {
			...roles,
			[role]: true,
		};
	});
}

export async function validateRole(req, res, next) {
	// verify User is correct role
	try {
		const roles = [Roles.ANGEL, Roles.ADMIN];
		const userRoles =
			(await get(`${rolesPrefix}${req.user.id}`)) || makeDefaultRole();
		const validRole = roles.some(role => userRoles[role]);
		if (!validRole) {
			return res.status(400).json({
				msg: `User with id: ${req.user.id} does not have a valid role for this
			 action`})
		}
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).json({ err, msg: "Server Error." });
	}
};

export async function validateAdminRole(req, res, next) {
	// verify User is correct role
	try {
		const roles = [Roles.ADMIN];
		const userRoles =
			(await get(`${rolesPrefix}${req.user.id}`)) || makeDefaultRole();
		const validRole = roles.some(role => userRoles[role]);
		if (!validRole) {
			return res.status(400).json({
				msg: `User with id: ${req.user.id} does not have a valid role for this
			 action`})
		}
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).json({ err, msg: "Server Error." });
	}
};

export async function validateAngelRole(req, res, next) {
	// verify User is correct role
	try {
		const roles = [Roles.ANGEL];
		const userRoles =
			(await get(`${rolesPrefix}${req.user.id}`)) || makeDefaultRole();
		const validRole = roles.some(role => userRoles[role]);
		if (!validRole) {
			return res.status(400).json({
				msg: `User with id: ${req.user.id} does not have a valid role for this
			 action`})
		}
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).json({ err, msg: "Server Error." });
	}
};
