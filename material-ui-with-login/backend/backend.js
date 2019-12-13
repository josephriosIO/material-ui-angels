import { get, update, find, Q } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';
require('dotenv').config();

const { ADMIN_USER_EMAIL } = process.env;

const usersPrefix = 'users__';
const startupsPrefix = 'startups__';
const rolesPrefix = 'roles__';

const Roles = {
  ADMIN: 'ADMIN',
  ANGEL: 'ANGEL',
  STARTUP: 'STARTUP',
  GUEST: 'GUEST',
};

const makeDefaultRole = () => {
  return Object.keys(Roles).reduce((aggr, curr) => {
    return {
      ...aggr,
      [curr]: false,
    };
  }, {});
};

// const uniqueInsert = (arr, ele) => {
//   const copy = [...arr];
//   if (!copy.includes(ele)) {
//     copy.push(ele);
//   }
//   return copy;
// };

async function validateRole(roles) {
  const user = getCurrentUser(true);
  const userRoles =
    (await get(`${rolesPrefix}${user.id}`)) || makeDefaultRole();
  const validRole = roles.some(role => userRoles[role]);
  if (!validRole) {
    throw new Error(`User with id: ${user.id} does not have a valid role for this
action`);
  }
  return user;
}

async function checkIfUserHasRole(userId, role) {
  const userRoles = (await get(`${rolesPrefix}${userId}`)) || makeDefaultRole();
  if (userRoles[role] !== true) {
    return false;
  }

  return true;
}

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

// example of limiting access to a specific role(s)
/* @expose */
export async function makeUserAngel(userId) {
  await validateRole([Roles.ADMIN]);

  if (await checkIfUserHasRole(userId, [Roles.ANGEL])) {
    await removeRoleToUser(userId, Roles.ANGEL);
    return;
  }

  await addRoleToUser(userId, Roles.ANGEL);
}

/* @expose */
export async function makeUserAdmin(userId) {
  await validateRole([Roles.ADMIN]);

  if (await checkIfUserHasRole(userId, [Roles.ADMIN])) {
    await removeRoleToUser(userId, Roles.ADMIN);
    return;
  }

  await addRoleToUser(userId, Roles.ADMIN);
}

/* @expose */
export async function getRolesOfUsers(userId) {
  await validateRole([Roles.ADMIN]);

  const usersRoles = await update(
    `${rolesPrefix}${userId}`,
    (roles = makeDefaultRole()) => {
      return roles;
    },
  );

  return usersRoles;
}

/* @expose */
export async function getAllStartups() {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);
  const rolesQuery = await find(
    Q.filter(Q.all(Q.key.startsWith(rolesPrefix), Q.value.STARTUP.eq(true))),
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
          return Q.key.startsWith(`${startupsPrefix}${id}`);
        }),
      ),
    ),
  );
  return usersQuery.map(({ value }) => value);
}

/* @expose */
export async function getAllAngels() {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);
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

/* @expose */
export async function getAllUsersThatAreNotAStartup() {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);
  const rolesQuery = await find(
    Q.filter(Q.all(Q.key.startsWith(rolesPrefix), Q.value.STARTUP.eq(false))),
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

/* @expose */
export async function getRole() {
  const { id } = getCurrentUser(true);
  console.log(id);
  const usersRoles = await update(
    `${rolesPrefix}${id}`,
    (roles = makeDefaultRole()) => {
      return roles;
    },
  );

  console.log(usersRoles);

  return usersRoles;
}

/* @expose */
export async function updateUser(fields) {
  const { id } = getCurrentUser(true);
  const { name, location, phoneNumber, bio } = fields;
  return update(`${usersPrefix}${id}`, userToUpdate => {
    if (!userToUpdate) {
      throw new Error('User does not exist');
    }
    const copy = { ...userToUpdate };
    copy.name = name;
    copy.location = location;
    copy.phoneNumber = phoneNumber;
    copy.bio = bio;

    return copy;
  });
}

/* @expose */
export async function updateStartupProfile(fields) {
  const { id } = getCurrentUser(true);
  const {
    companyName,
    location,
    website,
    missionStatement,
    companySize,
  } = fields;
  return update(`${startupsPrefix}${id}`, startupToUpdate => {
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
}

/* @expose */
export async function createOrGetStartup() {
  const profile = getCurrentUser(true);

  const addStartup = await update(`${startupsPrefix}${profile.id}`, startup => {
    addRoleToUser(profile.id, Roles.STARTUP);
    if (startup) {
      return startup;
    }
    return {
      id: profile.id,
      name: profile.displayName,
      img: profile.picture,
      email: profile.emails,
      phoneNumber: null,
      missionStatement: '',
      location: '',
      website: '',
      companyName: '',
      companySize: 0,
      completed: false,
      funded: false,
    };
  });

  return addStartup;
}

/* @expose */
export async function createOrGetUser() {
  const profile = getCurrentUser(true);

  const addUser = await update(`${usersPrefix}${profile.id}`, user => {
    console.log(profile.emails[0]);
    if (profile.emails[0].value === ADMIN_USER_EMAIL) {
      addRoleToUser(profile.id, Roles.ADMIN);
    }

    if (user) {
      return user;
    }
    return {
      id: profile.id,
      name: profile.displayName,
      img: profile.picture,
      email: profile.emails,
      phoneNumber: null,
      bio: '',
      location: '',
    };
  });

  return addUser;
}
