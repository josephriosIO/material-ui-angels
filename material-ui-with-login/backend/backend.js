import { get, update } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

/* @expose */
export async function setUsersToBackend(profile) {
  const { id } = getCurrentUser(true);
  return update('testusersss', (users = []) => {
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
  const users = await get('testusersss');

  return users;
}

// async function validateRole(user) {
//   console.log('running');
//   const { id } = getCurrentUser(true);
//   if (user.id === id) {
//     if (user.admin === false) {
//       return true;
//     } else {
//       throw new Error(`User with id: ${user.id} does not have a valid role for this
//       action`);
//     }
//   }
// }

/* @expose */
export async function updateStatus(userId, admin, angel) {
  const { id } = getCurrentUser(true);
  return update('testusersss', (users = []) => {
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
  const users = await get('testusersss');

  return users.map(user => {
    if (user.id === id) {
      return { ...user };
    }
  });
}

/* @expose */
export async function updateProfile(profile) {
  const { id } = getCurrentUser(true);
  const { name, location, bio, phoneNumber } = profile;

  return update('testusersss', (users = []) => {
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
