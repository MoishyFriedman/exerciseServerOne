const express = require("express");
const { writeFile: write } = require("jsonfile");
const { readFile: read } = require("jsonfile");
const { isEmail: checkEmail } = require("validator");
const { isStrongPassword: checkPassword } = require("validator");
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const { v4: uuidV4 } = require("uuid");

const app = express();
const port = 3000;
const pathFile = "./data.json";

function check(req, res, next) {
  if (checkEmail(req.body.email) && checkPassword(req.body.password)) {
    next();
  } else {
    res.send("Invalid email or password").status(400);
  }
}

function cryptPassword(req, res, next) {
  req.body.password = bcrypt.hashSync(req.body.password, 5);
  next();
}

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await read("./data.json");
  res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  const users = await read("./data.json");
  const user = users.find((user) => user.id === req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).send("User not found");
  }
});

app.post("/user", check, cryptPassword, async (req, res) => {
  const users = await read("./data.json");
  req.body.id = uuidV4();
  users.push(req.body);
  await write(pathFile, users);
  res.send("User additional").status(200);
});

app.post("/user/login", async (req, res) => {
  const users = await read("./data.json");
  const user = users.find((user) => user.email === req.body.email);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send("User is connected").status(200);
  } else {
    res.send("Wrong credentials").status(400);
  }
});

app.put("/email&password/:id", check, cryptPassword, async (req, res) => {
  const users = await read("./data.json");
  const user = users.find((user) => user.id === req.params.id);
  if (req.body.email) {
    user.email = req.body.email;
  }
  if (req.body.password) {
    user.password = req.body.password;
  }
  await write(pathFile, users);
  res.send("User update").status(200);
});

app.put("/product/:id", async (req, res) => {
  const users = await read("./data.json");
  const userIndex = users.findIndex((user) => user.id === req.params.id);
  const randomProduct = Math.floor(Math.random() * 101);
  try {
    const getProduct = await fetch(
      "https://dummyjson.com/products/" + randomProduct
    );
    if (getProduct.ok) {
      users[userIndex].product = await getProduct.json();
    } else {
      throw new Error(`product can't found`);
    }
  } catch (error) {
    res.send(error).status(400);
  }
  try {
    const method = {
      method: "post",
      body: users[userIndex],
    };
    const addUser = await fetch(
      "https://jsonplaceholder.typicode.com/users",
      method
    );
    if (addUser.ok) {
      console.log(await addUser.json());
    } else {
      throw new Error(`user don't update`);
    }
  } catch (error) {
    res.send(error).status(400);
  }
  await write(pathFile, users);
  res.send("User update").status(200);
});

app.delete("/user/:id", async (req, res) => {
  const users = await read("./data.json");
  const index = users.findIndex((user) => user.id === req.params.id);
  users.splice(index, 1);
  await write(pathFile, users);
  res.send("User deleted").status(200);
});

app.listen(port, () => {
  console.log(`Server is up and running on port:${port}`);
});
