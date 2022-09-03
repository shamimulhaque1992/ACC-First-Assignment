const getRandomUser = (users) => {
  const numberRandom = Math.floor(Math.random() * users.length);
  const randomUser = users[numberRandom];
  if (!randomUser) {
    getRandomUser(users);
  } else {
    return randomUser;
  }
};

module.exports = getRandomUser;