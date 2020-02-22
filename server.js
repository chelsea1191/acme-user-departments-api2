const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const bodyParser = require('body-parser');
let uuid = require('uuid/v4');
app.use(require('cors')());
app.use(bodyParser.json());

app.get('/api/departments', (req, res, next) => {
  db.readDepartments()
    .then(departments => res.send(departments))
    .catch(next);
});

app.get('/api/departments/:id', (req, res, next) => {
  db.readDepartments()
    .then(departments => res.send(departments))
    .catch(next);
});

app.get('/api/users', (req, res, next) => {
  db.readUsers()
    .then(users => res.send(users))
    .catch(next);
});

app.get('/api/users/:id', (req, res, next) => {
  db.readUsers()
    .then(users => res.send(users))
    .catch(next);
});

app.post('/api/departments', async (req, res, next) => {
  await db
    .createDepartment(req.body.name)
    .then(department => res.send(department[0]))
    .catch(next);
});
app.post('/api/users', async (req, res, next) => {
  await db
    .createUser(req.body.name, req.body.departmentId)
    .then(user => {
      res.send(user);
    })
    .catch(next);
});

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

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
  console.log('synced');
  app.listen(port, () => console.log(`listening on port ${port}`));
});
