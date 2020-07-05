const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const Joi = require("joi");

const SECRET = "hemligt";

let users = [];

function createSalt(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

function hashPassword(password, salt) {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const value = hash.digest("hex");
  return {
    salt: salt,
    hash: value
  };
}

function generatePasswordHash(password) {
  const salt = createSalt(16);
  return hashPassword(password, salt);
}

function validatePassword(password, { hash, salt }) {
  const newHash = hashPassword(password, salt);

  const a = Buffer.from(hash, "utf8");
  const b = Buffer.from(newHash.hash, "utf8");

  return crypto.timingSafeEqual(a, b);
}

app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.trim().split(" ");

  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    req.token = parts[1] || null;
  }

  next();
});

const AUTH_SCHEMA = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(3)
    .max(40)
});

const TODO_SCHEMA = Joi.object().keys({
  content: Joi.string()
    .min(1)
    .max(100)
    .required()
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", (req, res) => {
  const result = Joi.validate(req.body, AUTH_SCHEMA);

  if (result.error) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      details: result.error.details
    });
  }

  const { email, password } = req.body;

  const passwordHash = generatePasswordHash(password);

  const userWithEmailExists = !!users.find(x => x.email === email);

  if (userWithEmailExists) {
    return res.status(400).json({
      status: "error",
      message: "User with that email address exists"
    });
  }

  const user = {
    email,
    passwordHash,
    todos: []
  };

  users = [...users, user];

  return res.status(201).json({
    status: "success",
    email
  });
});

app.post("/auth", (req, res) => {
  const result = Joi.validate(req.body, AUTH_SCHEMA);

  if (result.error) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      details: result.error.details
    });
  }

  const { email, password } = req.body;

  const user = users.find(x => x.email === email);

  if (!user || !validatePassword(password, user.passwordHash)) {
    return res.status(401).json({
      status: "error",
      message: "Email or password incorrect"
    });
  }

  const token = jwt.sign(
    {
      email
    },
    SECRET,
    {
      expiresIn: "1h"
    }
  );

  return res.status(200).json({
    status: "success",
    token
  });
});

function getUser(token) {
  try {
    const { email } = jwt.verify(token, SECRET);
    const user = users.find(x => x.email === email);
    return user;
  } catch (err) {
    return null;
  }
}

app.get("/todos", (req, res) => {
  const user = getUser(req.token);

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized"
    });
  }

  return res.json({ todos: user.todos });
});

app.post("/todos", (req, res) => {
  const user = getUser(req.token);

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized"
    });
  }

  const result = Joi.validate(req.body, TODO_SCHEMA);

  if (result.error) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      details: result.error.details
    });
  }

  const { content } = req.body;
  const todo = {
    content,
    id: uuid()
  };

  user.todos = [...user.todos, todo];

  if (user.todos.length > 20) {
    user.todos.shift();
  }

  return res.status(201).json({
    status: "success",
    todo
  });
});

app.delete("/todos/:id", (req, res) => {
  const user = getUser(req.token);

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized"
    });
  }

  const id = req.params.id;
  const index = user.todos.findIndex(x => x.id === id);

  if (index < 0) {
    return res.status(404).json({
      status: "error",
      message: "Todo does not exist"
    });
  }

  const t = user.todos;

  user.todos = [...t.slice(0, index), ...user.todos.slice(index + 1)];

  return res.status(204).send();
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
