import { get, update } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

/* @expose */
export async function setUsersToBackend(name, pic) {
  const { id } = getCurrentUser(true);

  return update('users', (users = []) => {
    let allUsers = JSON.parse(JSON.stringify(users));

    const user = {
      id,
      name,
      img: pic,
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
  const users = await get('users');

  return users;
}

/* @expose */
export async function updateStatus(id, admin, angel) {
  return update('users', (users = []) => {
    let allUsers = JSON.parse(JSON.stringify(users));

    allUsers.map(user => {
      if (user.id === id) {
        user.admin = admin;
        user.angel = angel;
      }
    });

    return allUsers;
  });
}
