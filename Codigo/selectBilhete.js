const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

module.exports = async function selectBilhete(bilhetes) {

    let connection;
  
    try {

        connection = await oracledb.getConnection(dbConfig);
  
        const result = await connection.execute(
        
        `SELECT CODIGO_BILHETE
         FROM bilhetes
         where CODIGO_BILHETE = :id`,
  
        [bilhetes],
  
        {
          maxRows: 1

        });
  
      console.log(result.metaData);  
      console.log(result.rows);     
  
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
  