require('./executarBD');
async function select(codigo){
  try {
    const teste=await runQuery('SELECT COUNT (*) FROM bilhetes WHERE codigo_bilhete = :id',[codigo]);
    return teste;
  } catch (error) {
    console.log(error);
  }
}

module.exports = select();