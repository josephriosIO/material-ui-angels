import { get, update } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

/* @expose */
export async function testing(name, pic) {
  const { id } = getCurrentUser(true);

  return update('testagainagainagain', (users = []) => {
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
  const users = await get('testagainagainagain');

  return users;
}
