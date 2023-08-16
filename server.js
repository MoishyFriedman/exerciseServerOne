const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const uuid = require("uuid");
const v4 = uuid.v4;

const users = [
  { id: v4(), email: "ewef@gmail.com", password: "re45fea" },
  { id: v4(), email: "lk@gmail.com", password: "re45090a" },
  { id: v4(), email: "cs@gmail.com", password: "8885fea" },
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
  res.status(200).json(users.find((user) => user.id === req.params.id));
});

app.post("/", cryptPassword, (req, res) => {
  req.body.id = v4();
  users.push(req.body);
  res.send("user additional").status(200);
});

app.post("/login", (req, res) => {
  let user = users.find((user) => {
    return user.email === req.body.email && bcrypt.compareSync(req.body.password, user.password);
  });
  if (user === undefined) {
    res.send("wrong credentials").status(400);
  } else {
    res.send("User is connected").status(200);
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
  users.splice(req.params.id, 1);
  res.status(200);
  res.send("user deleted");
});

app.listen(port, () => {
  console.log(`Server is up and running on port:${port}`);
});
