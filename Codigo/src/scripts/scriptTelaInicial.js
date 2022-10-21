const conexao = require('../../connect.js');

async function gerarCodigo () {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    cod = '';
    for (i = 0; i < 8; i++) {cod += chars.charAt(Math.floor(Math.random() * chars.length));}

    textNode = document.createTextNode(cod);
    document.getElementById("res").textContent = "Seu código: " + cod;
    console.dir(cod);
    result = 
        `INSERT INTO BILHETES VALUES (:id)`,
        [cod],
        { autoCommit: true }
      ;
      await conexao(result);
}

function copiaTexto (idOrigem, idDestino){
    var txtOrigem = document.getElementById(idOrigem); //
    var txtDestino = document.getElementById(idDestino); //
    return txtDestino.value = txtOrigem.value;
}
module.exports = gerarCodigo();