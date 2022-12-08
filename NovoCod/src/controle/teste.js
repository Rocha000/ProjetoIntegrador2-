const { autoCommit } = require('oracledb');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

module.exports = teste = async (query) => {

  let connection;

  try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(query,[],
        { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return result;
  } catch (error) {
      return error.message;
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (error) {
              return error.message;
          }
      }
  }
}
