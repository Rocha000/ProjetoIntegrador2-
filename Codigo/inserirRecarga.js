process.env.ORA_SDTZ = 'America/Bahia';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

module.exports = async function inserirRecarga(codigo,tipoRecarga,valor) {

    let connection;
  
    try{
        connection = await oracledb.getConnection(dbConfig);
  
        let result = await connection.execute(
            'insert into recarga (FK_CODIGO_BILHETE,VALOR_BILHETE, data_recarga,tipo_recarga) values(:id,:id, sysdate,:id)',
            [codigo, valor, tipoRecarga],
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