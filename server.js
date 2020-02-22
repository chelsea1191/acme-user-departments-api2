const express = require("express");
const app = express();
const db = require("./db");
app.use(require("cors")());
app.use(express.json());
const path = require("path");
const bodyParser = require("body-parser");
let uuid = require("uuid/v4");
app.use(bodyParser.json());
const morgan = require("morgan");

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

//////////////////////////////////////get////////////////////////////////
app.get("/api/departments", (req, res, next) => {
  db.readDepartments()
    .then(departments => res.send(departments))
    .catch(next);
});
app.get("/api/departments/:id", (req, res, next) => {
  db.readDepartments()
    .then(departments => res.send(departments))
    .catch(next);
});
app.get("/api/users", (req, res, next) => {
  db.readUsers()
    .then(users => res.send(users))
    .catch(next);
});
app.get("/api/users/:id", (req, res, next) => {
  db.readUsers()
    .then(users => res.send(users))
    .catch(next);
});

////////////////////////////////////post//////////////////////////////
app.post("/api/departments", (req, res, next) => {
  db.createDepartment(req.body)
    .then(department => res.send(department))
    .catch(next);
});
app.post("/api/users", (req, res, next) => {
  db.createUser(req.body)
    .then(user => {
      res.send(user);
    })
    .catch(next);
});

/////////////////////////////////////put//////////////////////////////
app.put("/api/departments/:id", (req, res, next) => {
  db.updateDepartment(req.body)
    .then(dept => res.send(dept))
    .catch(next);
});
app.put("/api/users/:id", (req, res, next) => {
  db.updateUser({ ...req.body, id: req.params.id })
    .then(user => res.send(user))
    .catch(next);
});

/////////////////////////////////////delete//////////////////////////
app.delete("/api/departments/:id", (req, res, next) => {
  db.deleteDepartment(req.params.id)
    .then(() => res.sendStatus(204)) //since no return
    .catch(next);
});
app.delete("/api/users/:id", (req, res, next) => {
  db.deleteUser(req.params.id)
    .then(() => res.sendStatus(204)) //since no return
    .catch(next);
});

/////////////////////////////////////use/////////////////////////////
app.use((req, res, next) => {
  next({
    status: 404,
    message: `page not found - (method is ${req.method}) - (url is ${req.url})`
  });
});
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err.toString() });
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
  console.log("synced");
  app.listen(port, () => console.log(`listening on port ${port}`));
});
