const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const morgan = require("morgan");

const users = [
  { id: 0, email: "ewef@gmail.com", password: "re45fea" },
  { id: 1, email: "lk@gmail.com", password: "re45090a" },
  { id: 2, email: "cs@gmail.com", password: "8885fea" },
];

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json(users);
});

app.get("/:id", (req, res) => {
  res.status(200).json(users[req.params.id]);
});

app.post("/", (req, res) => {
  users.push(req.body);
  res.send("user additional");
});

app.put("/:id", (req, res) => {
  if (req.body.email) {
    users[req.params.id].email = req.body.email;
  }
  if (req.body.password) {
    users[req.params.id].password = req.body.password;
  }
  res.status(200)
  res.send("user update");
});

app.delete("/:id", (req, res) => {
  users.splice(req.params.id, 1)
  res.status(200)
  res.send("user deleted");
});

app.listen(port, () => {
  console.log(`Server is up and running on port:${port}`);
});
