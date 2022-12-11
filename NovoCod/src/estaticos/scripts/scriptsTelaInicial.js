const select = require('../../controle/select');
require('../../controle/executarBD');


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
async function gerarCodigo (aceite) {
    if (document.getElementById(aceite).checked == false) {
        document.getElementById("res").textContent = "Você precisa aceitar os termos de uso!";
        return null;
    }
    chars = '123456789';
    cod = '';
    for (i = 0; i < 8; i++) {cod += chars.charAt(Math.floor(Math.random() * chars.length));}
    
    document.getElementById("res").textContent = "Seu código: " + cod;
    console.dir(cod);
    await fetch(`http://localhost:8080/bilhetes/create/${cod}`,{method:"POST"}).catch(console.log(res))
}

async function gerarRecarga (aceite,tipo,valor,credito) {
    try{
        if (document.getElementById(aceite).checked == false) {
            document.getElementById("avisoRecarga").textContent = "Você precisa aceitar os termos de uso!";
            return null;
        }
        const cod = document.getElementById('codigoBilhete').value;
        document.getElementById("avisoRecarga").textContent = "";
        const response = await fetch(`http://localhost:8080/verificacao/${cod}`,{method:"POST"}).then((existe)=> existe.json());
        const data = response.COUNT
        if (data == 1){
            document.getElementById("avisoRecarga").innerHTML = "Recarga efetuada!";
            await fetch(`http://localhost:8080/codrecarga/create/${cod}/${tipo}/${valor}/${credito}`,{method:"POST"});
        }else{
            document.getElementById("avisoRecarga").innerHTML = "código invalido!";
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

// const OpenModalButton = document.querySelector('#open-modal');
// const closeModalButton = document.querySelector('#close-moda');

const toggleModal = () => {
    const modal = document.querySelector('#modal');
    const fade = document.querySelector('#fade');
    modal.classList.toggle('hidden');
    fade.classList.toggle('hidden');
};

// [OpenModalButton, closeModalButton, fade,utilizacao].forEach((el)) =>{
//     el.addEventListener('click', () => toggleModal
// }



async function utilizacao(){
    var tempo;
    var data = new Date()
    
    const cod = document.getElementById('codigoBilhete').value;
    const response = await fetch(`http://localhost:8080/verificacao/${cod}`,{method:"POST"}).then((existe)=> existe.json());
    const dado = response.COUNT
    if(dado == 1){
        console.log('sim')
        const tipoBilhete = await fetch(`http://localhost:8080/utilizacao/tipo/${cod}`,{method:"POST"}).then((tipo)=> tipo.json());
        console.log(tipoBilhete);
        creditoR = await fetch (`http://localhost:8080/recarga/credito/${cod}`,{method:"POST"}).then((credito)=> credito.json());
        console.log(creditoR);
        switch (tipoBilhete){
            case "unico":
                tempo = 0.667;
                document.getElementById("").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 40 minutos";
                break;
            case 'duplo':
                document.getElementById("").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 40 minutos, 2 vezes"
                tempo = 0.667;
                break;
            case '7dias':
                document.getElementById("").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 7 dias";
                tempo = 168;
                break;
            case '30dias':
                document.getElementById("").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 30 dias";
                tempo = 720;
                break;
        } 
        
        console.log(element);
        if(creditoR != 0){
            console.log(creditoR);
            var dataExpiracaoFormat = formatarData(addHoursToDate(data,tempo));
            existeRec = await fetch(`http://localhost:8080/utilizacao/confirmarRecarga/${cod}`,{method:"POST"}).then((existeRecarga)=> existeRecarga.json());
            console.log(tempo);
            console.log(existeRec);
            if(existeRec != 0){
                console.log("fdp")
                const print = await fetch(`http://localhost:8080/utilizacao/create/${cod}/${tempo}`,{method:"POST"}).then((sexu)=> sexu.json());
                if(print == 1){
                    document.getElementsByClassName("labelDataEx").innerHTML =  dataExpiracaoFormat;
                    toggleModal();
                }
            }else{
                document.getElementById("infos").innerHTML = "Você não realizou nenhuma recarga";
            }
        }else{

            const dataExpiracao = await fetch(`http://localhost:8080/utilizacao/dataEx/${cod}`,{method:"POST"}).then((dataexpiracao)=> dataexpiracao.json());
            
            if(dataExpiracao == 1){
                document.getElementById("infos").innerHTML = "Sua recarga expirou";
            }else{
                
                document.getElementById("infos").innerHTML = "Tipo " + tipoBilhete + " válida"
            }
        }
    }else{
        document.getElementById("infos").innerHTML ="cod invalido";
        
    }


}

async function gerenciamento(){

}





module.exports = gerarCodigo(); 
module.exports = gerarRecarga();
module.exports = includeHTML();
module.exports = utilizacao();
