import { get, update } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

/* @expose */
export async function setStartupsToBackend(profile) {
  const { id } = getCurrentUser(true);
  return update('startupstesting', (users = []) => {
    let allStartups = JSON.parse(JSON.stringify(users));
    const user = {
      id,
      name: profile.displayName,
      img: profile.picture,
      email: profile.emails,
      companyName: '',
      phoneNumber: null,
      companySize: 0,
      funded: false,
      missionStatement: '',
      location: '',
      startup: true,
      user: true,
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
  return update('userTesting', (users = []) => {
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
  const users = await get('userTesting');

  return users;
}

/* @expose */
export async function getStartups() {
  const startups = await get('startupstesting');

  return startups;
}

/* @expose */
export async function updateStatus(userId, admin, angel) {
  const { id } = getCurrentUser(true);
  return update('userTesting', (users = []) => {
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
  const users = await get('userTesting');

  return users.filter(user => user.id === id);
}

/* @expose */
export async function getStartup() {
  const { id } = getCurrentUser(true);
  const startups = await get('startupstesting');

  return startups.filter(user => user.id === id);
}

/* @expose */
export async function updateProfile(profile) {
  const { id } = getCurrentUser(true);
  const { name, location, bio, phoneNumber } = profile;

  return update('userTesting', (users = []) => {
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
  } = profile;

  return update('startupstesting', (users = []) => {
    let allStartups = JSON.parse(JSON.stringify(users));
    allStartups.map(user => {
      if (user.id === id) {
        user.companyName = companyName;
        user.location = location;
        user.phoneNumber = phoneNumber;
        user.missionStatement = missionStatement;
        user.companySize = companySize;
        user.funded = funded;
      }
    });

    return allStartups;
  });
}
