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

function isDigit(n) {
    return /^\d+$/.test(n);
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
        if(!isDigit(cod)) {
            document.getElementById("avisoRecarga").innerHTML ="código inválido";
            return null;
        };
        document.getElementById("avisoRecarga").textContent = "";
        const response = await fetch(`http://localhost:8080/verificacao/${cod}`,{method:"POST"}).then((existe)=> existe.json());
        const data = response.COUNT
        if (data == 1){
            const countRecarga = await fetch(`http://localhost:8080/recarga/validacao/${cod}`,{method:"POST"}).then((credito)=>credito.json());
            if (countRecarga != 0){
                document.getElementById("avisoRecarga").innerHTML = "Já possui uma recarga ativa!";
            }else{
                document.getElementById("avisoRecarga").innerHTML = "Recarga efetuada!";
                await fetch(`http://localhost:8080/codrecarga/create/${cod}/${tipo}/${valor}/${credito}`,{method:"POST"});

            }
        }else{
            document.getElementById("avisoRecarga").innerHTML = "código inválido!";
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

function toggleModal(){

    const modal =document.getElementById('modal');
    const fade = document.getElementById('fade');
    modal.classList.toggle('hide');
    fade.classList.toggle('hide');
};

async function utilizacao(){
    var tempo;
    var data = new Date();
    const cod = document.getElementById('codigoBilhete').value;
    if(!isDigit(cod)) {
        toggleModal();
        document.getElementById("faladele").innerHTML ="código inválido";
        return null;
    };
    const response = await fetch(`http://localhost:8080/verificacao/${cod}`,{method:"POST"}).then((existe)=> existe.json());
    const dado = response.COUNT;
    if(dado == 1){
        const existeRec = await fetch(`http://localhost:8080/utilizacao/confirmarRecarga/${cod}`,{method:"POST"}).then((existeRecarga)=> existeRecarga.json());
        if(existeRec != 0){
            const tipoBilhete = await fetch(`http://localhost:8080/utilizacao/tipo/${cod}`,{method:"POST"}).then((tipo)=> tipo.json());
            switch (tipoBilhete){
                case "unico":
                    document.getElementById("infosBilhete").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 40 minutos";
                    tempo = 0.667;
                    break;
                case 'duplo':
                    document.getElementById("infosBilhete").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 40 minutos, 2 vezes"
                    tempo = 0.667;
                    break;
                case '7dias':
                    document.getElementById("infosBilhete").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 7 dias";
                    tempo = 168;
                    break;
                case '30dias':
                    document.getElementById("infosBilhete").innerHTML = "O crédito do bilhete será debitado pelo sistema. Você poderá utilizar o bilhete em qualquer e quantos transportes quiser, durante 30 dias";
                    tempo = 720;
                    break;
            } 
            var dataExpiracaoFormat = formatarData(addHoursToDate(data,tempo));
            const creditoR = await fetch (`http://localhost:8080/recarga/credito/${cod}`,{method:"POST"}).then((credito)=> credito.json());
           
            if(creditoR != 0){
                const print = await fetch(`http://localhost:8080/utilizacao/create/${cod}/${tempo}`,{method:"POST"}).then((objeto)=> objeto.json());
                if(print == 1){
                    document.getElementById("faladele").innerHTML = "Tipo do bilhete: " + tipoBilhete +`<br>`+ "Data de Expiração: " + dataExpiracaoFormat
                }
            }else{
                const dataExpiracao = await fetch(`http://localhost:8080/utilizacao/dataEx/${cod}`,{method:"POST"}).then((objeto)=> objeto.json());
                
                if(dataExpiracao == 1){
                    document.getElementById("faladele").innerHTML = "Sua recarga expirou";
                    document.getElementById("infosBilhete").innerHTML = "";
                }else{
                    document.getElementById("faladele").innerHTML = "Tipo " + tipoBilhete + " válido";
                }
            }
        }else{
                document.getElementById("infosBilhete").innerHTML = "";
                document.getElementById("faladele").innerHTML = "Você não realizou nenhuma recarga";
        }
    }else{
            document.getElementById("infosBilhete").innerHTML = "";
            document.getElementById("faladele").innerHTML ="código inválido";
    }
    toggleModal();
}

async function addDiv(tipo,dataGeracao, dataRecarga, dataUtilizacao){
    let div = document.createElement('div');
    div.className = 'addElemento';
    div.innerHTML = `
    <div class="linha">
        <div>${dataGeracao}</div>
        <div>${tipo}</div>
        <div>${dataRecarga}</div>
        <div>${dataUtilizacao}</div>
    </div>`;
    document.querySelector('.conteudo').appendChild(div);
}

async function gerenciamento(){
    const cod = document.getElementById("codigoBilhete").value;
    if(!isDigit(cod)) {
        document.querySelector('.conteudo').innerHTML ='<b>Código inválido!</b>';
        return null;
    };
    const response = await fetch(`http://localhost:8080/verificacao/${cod}`,{method:"POST"}).then((existe)=> existe.json());
    const dado = response.COUNT;
    document.querySelector('.conteudo').innerHTML = "";
    if(dado == 1){
        var array = await fetch(`http://localhost:8080/gerenciamento/${cod}`,{method:"POST"}).then((array)=> array.json());
        for (i in array){
            addDiv(array[i].tipo, array[i].data_geracao, array[i].data_recarga, array[i].data_utilizacao); 
        }
    }else{
        document.querySelector('.conteudo').innerHTML = '<b>Código inválido!</b>';
    }
}

