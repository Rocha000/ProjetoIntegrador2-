function gerarCodigo(){
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    cod = 'Seu código: ';
    for (i = 0; i < 8; i++) {
        cod += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    textNode = document.createTextNode(cod);
    document.getElementById("res").textContent = cod;
    console.dir(cod);
    return cod;
}

function copiaTexto (idOrigem, idDestino){
    var txtOrigem = document.getElementById(idOrigem); //
    var txtDestino = document.getElementById(idDestino); //
    return txtDestino.value = txtOrigem.value;
}