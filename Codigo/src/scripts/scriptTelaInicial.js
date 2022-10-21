const inserirCod = require("../../inserirBD")

async function gerarCodigo () {
    chars = '0123456789';
    cod = '';
    for (i = 0; i < 8; i++) {cod += chars.charAt(Math.floor(Math.random() * chars.length));}
    
    document.getElementById("res").textContent = "Seu código: " + cod;
    console.dir(cod);
    await fetch(`http://localhost:8081/bilhetes/create/${cod}`,{method:"POST"}).catch(console.log(res))
}

/*function copiaTexto (idOrigem, idDestino){
    var txtOrigem = document.getElementById(idOrigem); //
    var txtDestino = document.getElementById(idDestino); //
    return txtDestino.value = txtOrigem.value;
}*/
module.exports = gerarCodigo();