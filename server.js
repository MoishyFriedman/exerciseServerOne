const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const uuid = require("uuid");
const uuidV4 = uuid.v4;

const users = [
  { id: uuidV4(), email: "ewef@gmail.com", password: "re45fea" },
  { id: uuidV4(), email: "lk@gmail.com", password: "re45090a" },
  { id: uuidV4(), email: "cs@gmail.com", password: "8885fea" },
];

function cryptPassword(req, res, next) {
  req.body.password = bcrypt.hashSync(req.body.password, 5);
  next();
}

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json(users);
});

app.get("/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).send("user not found");
  }
});

app.post("/", cryptPassword, (req, res) => {
  req.body.id = uuidV4();
  users.push(req.body);
  res.send("user additional").status(200);
});

app.post("/login", (req, res) => {
  const user = users.find((user) => user.email === req.body.email);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send("User is connected").status(200);
  } else {
    res.send("wrong credentials").status(400);
  }
});

app.put("/:id", cryptPassword, (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (req.body.email) {
    user.email = req.body.email;
  }
  if (req.body.password) {
    user.password = req.body.password;
  }
  res.status(200);
  res.send("user update");
});

app.delete("/:id", (req, res) => {
  let index = users.findIndex((user) => user.id === req.params.id);
  users.splice(index, 1);
  res.status(200);
  res.send("user deleted");
});

app.listen(port, () => {
  console.log(`Server is up and running on port:${port}`);
});
