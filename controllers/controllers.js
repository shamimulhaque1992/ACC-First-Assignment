const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const getRandomUser = require("../utilities/getRandomUser");
const formParseJson = require("../utilities/formParseJson");

const userFilePath = path.join(__dirname, "..", "data.json");

// All User
module.exports.allUsers = (req, res) => {
  const size = req.query.s;
  fs.readFile(userFilePath, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "400 Bad Request",
      });
    }
    if (data) {
      const parsedUsers = formParseJson(data);
      const users = size ? parsedUsers.slice(0, size) : parsedUsers;
      return res.status(200).json({
        users,
      });
    }
  });
};

// Random User
module.exports.randomUser = (req, res) => {
  fs.readFile(userFilePath, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: "400 Bad Request",
      });
    }
    if (users) {
      const parsedUsers = formParseJson(users);
      const randomUser = getRandomUser(parsedUsers);
      return res.status(200).json({
        user: randomUser,
      });
    }
  });
};

// Save User
module.exports.saveAUser = async (req, res) => {
  fs.readFile(userFilePath, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: "Something Went wrong",
      });
    } else {
      req.body.id = req.body.id ? req.body.id : shortid.generate();
      const parsedUsers = formParseJson(users);
      parsedUsers.push(req.body);
      const allUsers = JSON.stringify(parsedUsers);
      fs.writeFile(userFilePath, allUsers, (err) => {
        if (err) {
          return res.status(400).json({
            error: "Something Went wrong",
          });
        } else {
          res.status(201).json({
            message: "User Saved Successfully",
          });
        }
      });
    }
  });
};

// Update User
module.exports.updateUser = (req, res) => {
  fs.readFile(userFilePath, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "400 Bad Request",
      });
    }
    if (data) {
      const users = formParseJson(data);
      const user = users.find((user) => user.id === req.body.id);
      const updateParamsEntries = Object.entries(req.body);
      for (const key of updateParamsEntries) {
        const param = key[0];
        const value = key[1];
        user[param] = value;
      }
      const updatedUsers = users.map((user) => {
        if (user.id === req.body.id) {
          user = user;
        }
        return user;
      });
      const stringified = JSON.stringify(updatedUsers);
        fs.writeFile(userFilePath, stringified, (err) => {
          if (err) {
            return res.status(400).json({
              error: "400 Bad Request",
            });
          }
        });
    }
  });
  res.status(200).json({
    message: "200 successfully update",
  });
};

// Bulk-Update User
module.exports.bulkUpdate = async (req, res) => {
  for (const singleUpdate of req.body) {
    fs.readFile(userFilePath, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: "400 Bad Request",
        });
      }
      if (data) {
        const users = formParseJson(data);
        const user = users.find((user) => user.id === singleUpdate.id);
        const updateEntries = Object.entries(singleUpdate);
        for (const entry of updateEntries) {
          const key = entry[0];
          const value = entry[1];
          user[key] = value;
        }
        users.map((u) => {
          if (u.id === user.id) {
            u = user;
            return u;
          }
        });
        const stringified = JSON.stringify(updateEntries);
        console.log(stringified)
        fs.writeFile(userFilePath, stringified, (err) => {
          if (err) {
            return res.status(400).json({
              error: "400 Bad Request",
            });
          }
        });
      }
    });
  }
  res.status(200).json({
    message: "200 successfully update",
  });
};

// Delete User
module.exports.deleteUser = (req, res) => {
  fs.readFile(userFilePath, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "400 Bad Request",
      });
    }
    if (data) {
      const users = formParseJson(data);
      const usersAfterRemove = users.filter((user) => user.id !== req.body.id);
      fs.writeFile(userFilePath, JSON.stringify(usersAfterRemove), (err) => {
        if (err) {
          return res.status(400).json({
            error: "400 Bad Request",
          });
        } else {
          res.status(200).json({
            message: "user deleted",
          });
        }
      });
    }
  });
};
