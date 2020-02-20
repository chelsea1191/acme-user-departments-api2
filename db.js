const pg = require("pg")
const { Client } = pg
const uuid = require("uuid")
const client = new Client("postgres://localhost/departments")
client.connect()
const sync = async () => {
  //DROP and RECREATE TABLES
  const SQL = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments
    (
      id UUID PRIMARY KEY,
      name VARCHAR NOT NULL,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE users
    (
      id UUID PRIMARY KEY,
      name VARCHAR NOT NULL,
      CHECK (char_length(name) > 0),
      department_id UUID REFERENCES departments(id)
    );
`
  await client.query(SQL)
  //remember "departmentId" will need to be in quotes
}
const readDepartments = async () => {
  return []
}
const readUsers = async () => {
  return []
}
module.exports = {
  sync,
  readDepartments,
  readUsers
}
//you will eventually need to export all of these
/*
module.exports = {
  sync,
  readDepartments,
  readUsers,
  createDepartment,
  createUser,
  deleteDepartment,
  deleteUser,
  updateUser,
  updateDepartment
};
*/
