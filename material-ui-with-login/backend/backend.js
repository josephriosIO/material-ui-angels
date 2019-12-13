import { get, update, find, Q } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';
require('dotenv').config();

const { ADMIN_USER_EMAIL } = process.env;

const usersPrefix = 'users__';
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
  const profile = await validateRole([Roles.ANGEL, Roles.ADMIN]);
  const rolesQuery = await find(
    Q.all(Q.key.startsWith(rolesPrefix), Q.value.STARTUP.eq(true)),
  );
  const userIds = rolesQuery.map(({ key, value }) => {
    return key.slice(rolesPrefix.length, key.length);
  });
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
export async function getAllAngels() {
  // const profile = await validateRole([Roles.ANGEL, Roles.ADMIN]);
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
  const usersRoles = await update(
    `${rolesPrefix}${id}`,
    (roles = makeDefaultRole()) => {
      return roles;
    },
  );

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

//OLD

/* @expose */
export async function setStartupsToBackend(profile) {
  const { id } = getCurrentUser(true);
  return update('startups', (users = []) => {
    let allStartups = JSON.parse(JSON.stringify(users));
    const user = {
      id,
      name: profile.displayName,
      img: profile.picture,
      email: profile.emails,
      website: '',
      companyName: '',
      phoneNumber: null,
      companySize: 0,
      funded: false,
      missionStatement: '',
      location: '',
      startup: true,
      user: true,
      completed: false,
    };

    allStartups.push(user);
    allStartups = allStartups.filter(
      (user, index, self) => index === self.findIndex(t => t.id === user.id),
    );
    return allStartups;
  });
}

/* @expose */
export async function setUsersToBackend(profile) {
  const { id } = getCurrentUser(true);
  return update('angelss', (users = []) => {
    let allUsers = JSON.parse(JSON.stringify(users));
    const user = {
      id,
      name: profile.displayName,
      img: profile.picture,
      email: profile.emails,
      phoneNumber: null,
      bio: '',
      location: '',
      admin: true,
      angel: false,
      startup: false,
      user: true,
    };
    if (allUsers.length > 0) {
      user.admin = false;
    }
    allUsers.push(user);
    allUsers = allUsers.filter(
      (user, index, self) => index === self.findIndex(t => t.id === user.id),
    );
    return allUsers;
  });
}

/* @expose */
export async function getUsers() {
  const users = await get('angelss');

  return users;
}

/* @expose */
export async function getStartups() {
  try {
    const startups = await get('startups');

    return startups;
  } catch (err) {
    return console.error(err);
  }
}

/* @expose */
export async function updateStatus(userId, admin, angel) {
  const { id } = getCurrentUser(true);

  return update('angelss', (users = []) => {
    let allUsers = JSON.parse(JSON.stringify(users));
    allUsers.map(user => {
      if (user.id === id) {
        if (user.admin === true) {
          allUsers.map(user => {
            if (user.id === userId) {
              user.admin = admin;
              user.angel = angel;
            }
          });
        } else {
          throw new Error(`Don't do that!`);
        }
      }
    });
    return allUsers;
  });
}

/* @expose */
export async function getUser() {
  const { id } = getCurrentUser(true);
  const users = await get('angelss');

  return users.filter(user => user.id === id);
}

/* @expose */
export async function getStartup() {
  try {
    const { id } = getCurrentUser(true);
    const startups = await get('startups');

    return startups.filter(user => user.id === id);
  } catch (err) {
    return console.error(err);
  }
}

/* @expose */
export async function updateProfile(profile) {
  const { id } = getCurrentUser(true);
  const { name, location, bio, phoneNumber } = profile;

  return update('angelss', (users = []) => {
    let allUsers = JSON.parse(JSON.stringify(users));
    allUsers.map(user => {
      if (user.id === id) {
        user.name = name;
        user.location = location;
        user.phoneNumber = phoneNumber;
        user.bio = bio;
      }
    });

    return allUsers;
  });
}

/* @expose */
export async function updateStartupProfile(profile) {
  const { id } = getCurrentUser(true);
  const {
    location,
    missionStatement,
    phoneNumber,
    companyName,
    companySize,
    funded,
    website,
  } = profile;

  return update('startups', (users = []) => {
    let allStartups = JSON.parse(JSON.stringify(users));
    allStartups.map(user => {
      if (user.id === id) {
        user.companyName = companyName;
        user.location = location;
        user.phoneNumber = phoneNumber;
        user.missionStatement = missionStatement;
        user.companySize = companySize;
        user.funded = funded;
        user.website = website;
        user.completed = true;
      }
    });

    return allStartups;
  });
}
