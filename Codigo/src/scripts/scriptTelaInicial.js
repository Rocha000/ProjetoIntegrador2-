const inserirCod = require("../../inserirBD")

async function gerarCodigo (aceite) {
    if (document.getElementById(aceite).checked == false) {
        document.getElementById("res").textContent = "Você precisa aceitar os termos de uso!";
        return null;
    }
    console.log(aceite);
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    cod = '';
    for (i = 0; i < 8; i++) {cod += chars.charAt(Math.floor(Math.random() * chars.length));}
    
    document.getElementById("res").textContent = "Seu código: " + cod;
    console.dir(cod);
    await fetch(`http://localhost:8081/bilhetes/create/${cod}`,{method:"POST"}).catch(console.log(res))
}

function aparecerPopUp(popup) {
    document.getElementById(popup).style.display = "block";
    document.getElementById(popup).style.opacity = "1";
}

module.exports = gerarCodigo();