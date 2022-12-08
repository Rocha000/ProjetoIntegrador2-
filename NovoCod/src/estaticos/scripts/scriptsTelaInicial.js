const select = require('../../controle/select');
require('../../controle/executarBD');



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
    try{
        if (document.getElementById(aceite).checked == false) {
            document.getElementById("avisoRecarga").textContent = "Você precisa aceitar os termos de uso!";
            return null;
        }
        const cod = document.getElementById('codigoBilhete').value;
        document.getElementById("avisoRecarga").textContent = "";
        const response = await fetch(`http://localhost:8080/codrecarga/create/${cod}/${tipo}/${valor}`,{method:"POST"}).then((existe)=> existe.json());
        const data = response.COUNT
        if (data == 1){
            document.getElementById("avisoRecarga").innerHTML = "Recarga efetuada!";
        }else{
            document.getElementById("avisoRecarga").innerHTML = "cod invalido!";
        }  
    }catch(error){
        console.log(error);
    }
}


//utilização

function formatarData (data) {
    var dataString = data.getDate()  + "/" + (data.getMonth()+1) + "/" + data.getFullYear() + " " +
    data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    return dataString;
  }
  
function addHoursToDate(dateObj,intHour){
    var numberOfM1Seconds = dateObj.getTime();
    var addMlSeconds = (intHour * 60) * 60 * 1000;
    var newDateObj = new Date(numberOfM1Seconds + addMlSeconds);
  
    return newDateObj;
  }




async function utilizacao(codigo, tipo){
    var tempo;
    var data = new Date(); 
    switch (tipo){
        case 'unico':
            tempo = 0.667
        case 'duplo':
            tempo = 0.667;
        case '7dias':
            tempo = 168;
        case '30dias':
            tempo = 720;
    }  
    var dataGeracao = formatarData(data);
    var dataExpiracao = formatarData(addHoursToDate(data,tempo));
    await fetch(`http://localhost:8080/utilizacao/create/${codigo}/${tipo}/${dataGeracao}/${dataExpiracao}`,{method:"POST"});


}






module.exports = gerarCodigo(); 
module.exports = gerarRecarga();
module.exports = includeHTML();
