process.env.ORA_SDTZ = 'America/Bahia';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');


module.exports = async function inserirCod(codigo) {

    let connection;

    try{
        connection = await oracledb.getConnection(dbConfig);

        let result = await connection.execute(
            'insert into bilhetes (codigo_bilhete, data_compra) values(:id, sysdate)',
            [codigo],
            { autoCommit: true }
        );
        console.log("Linhas Inseridas com Sucesso: " + result.rowsAffected);
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