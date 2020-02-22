const pg = require("pg");
const { Client } = pg;
const uuid = require("uuid/v4");
const client = new pg.Client("postgres://localhost/departments");
client.connect();
const sync = async () => {
  // // DROP and RECREATE TABLES
  const SQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS departments;
      CREATE TABLE departments
      (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL unique,
        CHECK (char_length(name) > 0)
      );
      CREATE TABLE users
      (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL unique,
        CHECK (char_length(name) > 0),
        "departmentId" UUID references departments(id)
      );
  `;
  await client.query(SQL);
  // //remember "departmentId" will need to be in quotes
  const fashion = await createDepartment({ name: "Fashion" });
  const paleontology = await createDepartment({ name: "Paleontology" });
  await createUser({ name: "Rachel", departmentId: fashion.id });
  await createUser({ name: "Ross", departmentId: paleontology.id });
};

const createDepartment = async ({ name }) => {
  const SQL = `INSERT INTO departments (name) VALUES ($1) returning *;`;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};
const deleteDepartment = async id => {
  const SQL = `DELETE FROM departments WHERE (id) = ($1);`;
  await client.query(SQL, [id]);
};
const deleteUser = async id => {
  const SQL = `DELETE FROM users WHERE (id) = ($1);`;
  await client.query(SQL, [id]);
};
const createUser = async ({ name, departmentId }) => {
  const SQL = `INSERT INTO users (name, "departmentId") VALUES ($1, $2) returning *;`;
  const response = await client.query(SQL, [name, departmentId]);
  return response.rows[0];
};
const updateUser = async ({ name, departmentId, id }) => {
  const SQL = `UPDATE users SET (name) = ($1), "departmentId" = ($2) WHERE (id) = ($3) returning *;`;
  const response = await client.query(SQL, [name, departmentId || null, id]);
  return response.rows[0];
};
const updateDepartment = async ({ name, id }) => {
  const SQL = `UPDATE departments SET (name) = ($1) WHERE (id) = ($2) returning *;`;
  const response = await client.query(SQL, [name, id]);
  return response.rows[0];
};
const readDepartments = async () => {
  const SQL = `SELECT * FROM departments;`;
  const response = await client.query(SQL);
  return response.rows;
};
const readUsers = async () => {
  const SQL = `SELECT * FROM users;`;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  sync,
  readDepartments,
  readUsers,
  createDepartment,
  createUser,
  deleteDepartment,
  deleteUser,
  updateDepartment,
  updateUser
};
