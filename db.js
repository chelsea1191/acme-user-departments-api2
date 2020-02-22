const pg = require('pg');
const { Client } = pg;
const uuid = require('uuid/v4');
const client = new Client('postgres://localhost/departments');
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
      name VARCHAR NOT NULL,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE users
    (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR NOT NULL,
      CHECK (char_length(name) > 0),
      "departmentId" UUID REFERENCES departments(id)
  );

    INSERT INTO departments (id, name) VALUES (uuid_generate_v4(), 'Engineering');
  `;
  await client.query(SQL);
  // //remember "departmentId" will need to be in quotes
};

//DEPARTMENTS
const readDepartments = async () => {
  const SQL = `
  SELECT * FROM departments
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createDepartment = async name => {
  const SQL = `


  INSERT INTO departments (name) VALUES ($1)
  returning *
  `;
  const response = await client.query(SQL, [name]);

  return response.rows;
};

//USERS
const readUsers = async () => {
  const SQL = `
  SELECT * FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createUser = async (name, departmentId) => {
  const SQL = `
  INSERT INTO users (name, "departmentId") VALUES ($1, $2)
  returning *;
  `;
  const response = await client.query(SQL, [name, departmentId]);

  console.log(response);
  return response.rows;
};
module.exports = {
  sync,
  readDepartments,
  readUsers,
  createDepartment,
  createUser
};
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
