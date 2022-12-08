const select = require('../../controle/select');



async function gerarCodigo (aceite) {
    if (document.getElementById(aceite).checked == false) {
        document.getElementById("res").textContent = "Você precisa aceitar os termos de uso!";
        return null;
    }
    chars = 'a123456789';
    cod = '';
    for (i = 0; i < 8; i++) {cod += chars.charAt(Math.floor(Math.random() * chars.length));}
    
    document.getElementById("res").textContent = "Seu código: " + cod;
    console.dir(cod);
    await fetch(`http://localhost:8080/bilhetes/create/${cod}`,{method:"POST"}).catch(console.log(res))
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


async function gerarRecarga (aceite,tipo,valor) {
    if (document.getElementById(aceite).checked == false) {
        document.getElementById("avisoRecarga").textContent = "Você precisa aceitar os termos de uso!";
        return null;
    }
    const cod = JSON.stringify(document.getElementById('codigoBilhete').value);
    console.log(cod)
    let bilhete;
    bilhete = await select(cod);
    console.log(bilhete);
    if (bilhete == 0){
        document.getElementById("avisoRecarga").textContent = "invalido!";
        return null;
    }else{
        document.getElementById("avisoRecarga").textContent = "Recarga efetuada!";
        await fetch(`http://localhost:8080/codrecarga/create/${cod}/${tipo}/${valor}`,{method:"POST"}).catch(console.log(res))
    }
}
module.exports = gerarCodigo(); 
module.exports = gerarRecarga();
module.exports = includeHTML();
