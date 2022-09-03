const fs = require("fs");
const path = require("path");
const { check, validationResult } = require("express-validator");
const formParseJson = require("../utilities/formParseJson");
const userFilePath = path.join(__dirname, "..", "data.json");

exports.ValidSaveUser = [
  check("name").notEmpty().withMessage("name is required"),
  check("gender").notEmpty().withMessage("gender is required"),
  check("contact").notEmpty().withMessage("contact is required"),
  check("address").notEmpty().withMessage("address is required"),
  check("photoURL").notEmpty().withMessage("photoURL is required"),
];

exports.userIdValid = (req, res, next) => {
  if (!req.body.id) {
    return res.status(400).json({ error: "404 No id" });
  } else {
    fs.readFile(userFilePath, (err, data) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: "400 Bad Request",
        });
      }
      if (data) {
        const users = formParseJson(data);
        const userById = users.find((user) => user.id === req.body.id);
        if (userById) {
          next();
        } else {
          return res.status(400).json({ error: "404 No User" });
        }
      }
    });
  }
};

exports.validManyId = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "404 No body" });
  } else {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Body will be an array" });
    } else {
      for (const singleDoc of req.body) {
        if (!(typeof singleDoc === "object")) {
          return res.status(400).json({
            error: "Body will be an array of objects",
          });
        } else {
          if (!singleDoc.id) {
            return res.status(400).json({ error: "404 No User" });
          } else if (!(Object.keys(singleDoc).length > 1)) {
            return res.status(400).json({
              error: "There should be one more field to update the user",
            });
          } else {
            fs.readFile(userFilePath, (err, data) => {
              if (err) {
                return res.status(400).json({
                  success: false,
                  error: "400 Bad Request",
                });
              }
              if (data) {
                const users = formParseJson(data);
                const userById = users.find((user) => user.id === singleDoc.id);
                if (userById) {
                  next();
                } else {
                  return res.status(400).json({
                    error: "No User Exists By This Id",
                  });
                }
              }
            });
          }
        }
      }
    }
  }
};

exports.validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
