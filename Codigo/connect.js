'use strict';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

module.exports = async function conectar(comando) {
  let connection;

  try {
    // Get a non-pooled connection
    connection = await oracledb.getConnection(dbConfig);

    console.log('Connection was successful!');

    await connection.execute(
        comando
      );

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}