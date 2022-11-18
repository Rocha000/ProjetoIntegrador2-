const inserirCod = require("../../inserirBD")
const express = require('express');
const app = express();

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

function includeHTML() {
var z, i, elmnt, file, xhttp;
/*loop through a collection of all HTML elements:*/
z = document.getElementsByTagName("*");
for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain attribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
    /*make an HTTP request using the attribute value as the file name:*/
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
        if (this.status == 200) {elmnt.innerHTML = this.responseText;}
        if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
        /*remove the attribute, and call this function once more:*/
        elmnt.removeAttribute("w3-include-html");
        includeHTML();
        }
    }      
    xhttp.open("GET", file, true);
    xhttp.send();
    /*exit the function:*/
    return;
    }
}
};

function SobreNos () {
  app.post("/Carrinho", function(req,res){
    res.sendFile(__dirname + "/Carrinho.html");
  });
}

async function gerarRecarga (aceite,tipo,valor) {
    if (document.getElementById(aceite).checked == false) {
        document.getElementById("seila").textContent = "Você precisa aceitar os termos de uso!";
        return null;
    }
    const cod = document.getElementById('codigoBilhete').value 
    
    await fetch(`http://localhost:8081/codrecarga/create/${cod}/${tipo}/${valor}`,{method:"POST"}).catch(console.log(res))
}



module.exports = gerarCodigo();
module.exports = includeHTML();
module.exports = gerarRecarga();