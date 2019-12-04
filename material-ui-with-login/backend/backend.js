import { get, update } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

/* @expose */
export async function setUsersToBackend(name, pic) {
  const { id } = getCurrentUser(true);

  return update('testusers', (users = []) => {
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
  const users = await get('testusers');

  return users;
}

/* @expose */
export async function updateStatus(userId, admin, angel) {
  const { id } = getCurrentUser(true);
  return update('testusers', (users = []) => {
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
          throw 'dont do that!';
        }
      }
    });

    return allUsers;
  });
}
