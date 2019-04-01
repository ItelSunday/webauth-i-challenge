const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const server = express();

server.use(express.json());
server.use(helmet());

// LOGGER MIDDLEWARE
server.use(function(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
});

// ENDPOINTS
server.get("/", (req, res) => {
  res.send("Welcome to Web Authorization I Challenge API");
});

server.post("/api/register", async (req, res) => {
  let credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  try {
    if (credentials.username && credentials.password) {
      // const newUser = await Users.add(credentials);
      res.status(201).json(credentials);
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  try {
    if (username && password) {
      // const user = await Users.findBy({ username });
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).jason({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// This endpoint needs to be restricted unless user provides
// the right credentials in the headers
server.get("/api/users", restricted, (req, res) => {
  try {
    // users = Users.find()
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// AUTHORIZATION MIDDLEWARE
// function only(username) {
//   return function(req, res, next) {
//     if (req.headers.username === username) {
//       next();
//     } else {
//       res.status(403).json({ message: `you are not ${username}` });
//     }
//   };
// }

function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).jason({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ error: "Please include a username and password" });
  }
}

// DNE MIDDLEWARE
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist. Return to the main directory");
});

module.exports = server;
