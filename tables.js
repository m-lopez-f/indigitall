// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(128) UNIQUE NOT NULL,
        latitude VARCHAR(128),
        longitude VARCHAR(128),
        language VARCHAR(128),
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      );
      `;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.error('error', err);
      pool.end();
    });
}

/**
 * Create User Friends Table
 */
const createUserFriendsTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
    friends_user(
      id VARCHAR(128) PRIMARY KEY,
      user_id
      user_friend
    );
    `;

pool.query(queryText)
  .then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.error('error', err);
  });
}

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.error('error', err);
    });
}
const dropUserFriendsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS friends_user returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.error('error', err);
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

const createTables = () => {
  createUserTable();
  createUserFriendsTable();
}
const dropTables = () => {
  dropUserTable();
  dropUserFriendsTable();
}
module.exports = {
  createTables,
  dropTables
};

require('make-runnable');