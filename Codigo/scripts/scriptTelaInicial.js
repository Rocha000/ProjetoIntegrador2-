function gerarCodigo(){
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    cod = '';
    for (i = 0; i < 8; i++) {
        cod += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    console.dir(cod);
    textNode = document.createTextNode(cod);
    document.getElementById("res").appendChild(textNode);
    return cod;
}