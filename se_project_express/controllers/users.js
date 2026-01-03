const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  AuthError,
  UNAUTHORIZED,
} = require("../utils/errors");

const getUsers = (res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  return User.findOne({ email: String(email || "").trim() })
    .collation({ locale: "en", strength: 2 })
    .then((existing) => {
      if (existing) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }

      return bcrypt
        .hash(String(password || ""), 10)
        .then((hash) =>
          User.create({
            name,
            avatar,
            email,
            password: hash,
          })
        )
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          return res.status(201).send(userObj);
        });
    })
    .catch((err) => {
      if (err && err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  return User.findById(userId)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
    }
    return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occured on the server" });
  });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const update = {};
  if (typeof req.body.name !== "undefined") update.name = req.body.name;
  if (typeof req.body.avatar !== "undefined") update.avatar = req.body.avatar;

  if (Object.keys(update).length === 0) {
    return res.status(BAD_REQUEST).send({ message: "Nothing to update" });
  }

  return User.findByIdAndUpdate(userId, { $set: update }, {new: true, runValidators: true })
  .then ((user) => {
    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if(err.name === "ValidationError" || err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
    }
    return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occured on the server" });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
    .status(BAD_REQUEST)
    .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).send({ token });
  })
  .catch((err) => {
    if (err.message === "Incorrect email or password") {
      return res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occured on the server" });
  });
};

module.exports = { getUsers, createUser, getCurrentUser, updateCurrentUser, login };
