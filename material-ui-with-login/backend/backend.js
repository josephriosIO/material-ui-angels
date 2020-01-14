import { get, update, find, Q } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';
const uuidv4 = require('uuid/v4');

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

const makeDefaultRole = () => {
  return Object.keys(Roles).reduce((aggr, curr) => {
    return {
      ...aggr,
      [curr]: false,
    };
  }, {});
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
export async function getAllArchivedStartups() {
  await validateRole([Roles.ADMIN]);
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
  const startups = usersQuery.map(({ value }) => value);

  return startups.filter(startup => startup.archived);
}

/* @expose */
export async function getAllVettedStartups() {
  await validateRole([Roles.ADMIN]);
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
  const startups = usersQuery.map(({ value }) => value);

  return startups.filter(startup => !startup.archived && startup.vetted);
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
  const startups = usersQuery.map(({ value }) => value);

  return startups.filter(startup => !startup.archived);
}

/* @expose */
export async function getAllAngels() {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);

  const angels = await getAngels();

  return angels;
}

/* @expose */
export async function canVote(date) {
  const meetingDate = new Date(date);
  const current = new Date();

  return current.getTime() > meetingDate.getTime();
}

/* @expose */
export async function getAllUsersThatAreNotAStartup() {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);
  const rolesQuery = await find(Q.filter(Q.all(Q.key.startsWith(usersPrefix))));
  const userIds = rolesQuery.map(({ key, value }) => {
    return key.slice(usersPrefix.length, key.length);
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
    copy.editedProfile = true;

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
export async function archiveStartup(id) {
  await validateRole([Roles.ADMIN]);
  return update(`${startupsPrefix}${id}`, startupToUpdate => {
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
}

/* @expose */
export async function vetStartup(id) {
  await validateRole([Roles.ADMIN]);
  return update(`${startupsPrefix}${id}`, startupToUpdate => {
    if (!startupToUpdate) {
      throw new Error('User does not exist');
    }
    const copy = { ...startupToUpdate };

    if (startupToUpdate.vetted) {
      copy.vetted = false;
    } else {
      copy.vetted = true;
    }

    return copy;
  });
}

/* @expose */
export async function getUnseenStartups() {
  const profile = await createOrGetUser();
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

  const startupsQuery = await find(
    Q.filter(
      Q.any(
        ...userIds.map(id => {
          return Q.key.startsWith(`${startupsPrefix}${id}`);
        }),
      ),
    ),
  );

  if (profile.lastSeenStartup === null) {
    return startupsQuery.map(({ value }) => value);
  }

  const unseen = startupsQuery.filter(({ value }) => {
    if (value.registered > profile.lastSeenStartup) {
      return value;
    }
  });

  return unseen;
}

/* @expose */
export async function createMeeting(meetingInfo) {
  await validateRole([Roles.ADMIN]);
  const meetingId = uuidv4();
  const { startups, date, title } = meetingInfo;
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

  return createdMeeting;
}

/* @expose */
export async function getMeeting(meetingId) {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);
  const rolesQuery = await find(
    Q.filter(Q.all(Q.key.startsWith(meetingPrefix))),
  );
  const userIds = rolesQuery.map(({ key, value }) => {
    return key.slice(meetingPrefix.length, key.length);
  });

  if (userIds.length < 1) {
    return [];
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
  return usersQuery.filter(({ value }) => value.id === meetingId);
}

/* @expose */
export async function getMeetings() {
  await validateRole([Roles.ANGEL, Roles.ADMIN]);
  const rolesQuery = await find(
    Q.filter(Q.all(Q.key.startsWith(meetingPrefix))),
  );
  const userIds = rolesQuery.map(({ key, value }) => {
    return key.slice(meetingPrefix.length, key.length);
  });

  if (userIds.length < 1) {
    return [];
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
  return usersQuery.map(({ value }) => value);
}

/* @expose */
export async function checkIfUserVoted(meetingID) {
  const profile = getCurrentUser(true);

  const voted = await get(`${votingPrefix}${meetingID}${profile.id}`);

  if (voted) {
    return true;
  }
  return false;
}

/* @expose */
export async function getVotesByMeeting(meetingID) {
  console.log('before second validation');
  await validateRole([Roles.ADMIN]);

  const meetingQuery = await find(
    Q.filter(Q.all(Q.key.startsWith(`${votingPrefix}${meetingID}`))),
  );

  if (meetingQuery.length < 1) {
    throw new Error('no votes for this meeting.');
  }

  const meeting = meetingQuery.map(({ value }) => value);

  return meeting;
}

/* @expose */
export async function getStartupsAndPointsByMeetingId(meetingID) {
  const votes = await getVotesByMeeting(meetingID);

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

  return voteTotals;
}

/* @expose */
export async function getAngelById(angelID) {
  await validateRole([Roles.ADMIN]);

  const angels = await getAngels();

  return angels.filter(angel => angel.id === angelID);
}

/* @expose */
export async function createBug() {
  console.log('before first validation');
  await validateRole([Roles.ADMIN]);

  console.log('validated first time');

  const meeting = await getVotesByMeeting();

  console.log(meeting);
}

/* @expose */
export async function voteOnStartup(meetingID, votes) {
  const profile = getCurrentUser(true);
  const meeting = await getMeeting(meetingID);

  const ableToVote = await canVote(meeting[0].value.date);

  if (!ableToVote) {
    throw new Error('Not time to vote');
  }

  const addVote = await update(
    `${votingPrefix}${meetingID}${profile.id}`,
    vote => {
      if (vote) {
        throw new Error('Already voted.');
      }
      return {
        id: profile.id,
        votes,
      };
    },
  );

  return addVote;
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
      archived: false,
      vetted: false,
      registered: Date.now(),
    };
  });

  return addStartup;
}

/* @expose */
export async function createOrGetInvite() {
  const profile = getCurrentUser(true);
  const inviteCode = uuidv4();

  const addInvite = await update(`${invitesPrefix}${inviteCode}`, invite => {
    if (invite) {
      return invite;
    }
    return {
      id: profile.id,
      value: inviteCode,
      consumed: false,
      consumedBy: '',
    };
  });

  return addInvite;
}

/* @expose */
export async function consumeInvite(inviteCode) {
  const profile = getCurrentUser(true);

  return update(`${invitesPrefix}${inviteCode}`, inviteCodeToConsume => {
    if (!inviteCodeToConsume) {
      throw new Error('Invite is not valid.');
    }
    if (inviteCodeToConsume.consumed) {
      throw new Error('Code has been consumed.');
    }
    addRoleToUser(profile.id, Roles.ANGEL);
    const copy = { ...inviteCodeToConsume };

    copy.consumed = true;
    copy.consumedBy = profile.id;

    return copy;
  });
}

/* @expose */
export async function createOrGetUser() {
  const profile = getCurrentUser(true);

  const addUser = await update(`${usersPrefix}${profile.id}`, user => {
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
      lastSeenStartup: null,
      editedProfile: false,
    };
  });

  return addUser;
}
