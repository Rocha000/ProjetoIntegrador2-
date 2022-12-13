const express = require('express');
const app = express();
require('./src/controle/executarBD')


app.use(express.json());


app.use(express.static(__dirname + '/src/estaticos'));
//PARA DIGITAR PELO URL
app.get("/", function(req,res){
    res.sendFile(__dirname + "/src/paginas/TelaInicial.html");
});
app.get("/Recarga", function(req,res){
    res.sendFile(__dirname + "/src/paginas/Recarga.html");
});
app.get("/GeracaoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/GeracaoBilhete.html");
});
app.get("/GerenciamentoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/GerenciamentoBilhete.html");
});
app.get("/UtilizacaoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/UtilizacaoBilhete.html");
});

//PARA ACESSAR PELO BOTÃO
app.post("/", function(req,res){
    res.sendFile(__dirname + "/src/paginas/TelaInicial.html");
});
app.post("/Recarga", function(req,res){
    res.sendFile(__dirname + "/src/paginas/Recarga.html");
});
app.post("/GeracaoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/GeracaoBilhete.html");
});
app.post("/GerenciamentoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/GerenciamentoBilhete.html");
});
app.post("/UtilizacaoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/UtilizacaoBilhete.html");
});
  
app.post("/bilhetes/create/:cod", async (req,res,next)=>{ //INSERE O COD GERADO NA TABELA BILHETES
    await runQuery('insert into bilhetes (codigo_bilhete, data_geracao) values(:id, sysdate)',[req.params.cod]);
});

app.post("/verificacao/:cod", async (req,res,next)=>{ // VERIFICA SE O BILHETE EXISTE
    const existe = await runQuery('SELECT count (*) as COUNT FROM bilhetes WHERE codigo_bilhete = :id',[req.params.cod]);
    const dado = existe.rows[0].COUNT;
    return res.json(existe.rows[0]);
})

app.post("/codrecarga/create/:cod/:tipo/:valor/:credito", async (req,res,next)=>{ //INSERE NA TABELA RECARGA
        await runQuery('insert into recarga (FK_CODIGO_BILHETE,VALOR_BILHETE, data_e_hora_recarga,tipo_recarga, credito) values(:id,:id, sysdate,:id,:id)',
        [req.params.cod, req.params.valor, req.params.tipo, req.params.credito]);
});

app.post('/recarga/credito/:cod', async (req, res) => {// RETORNA O CREDITO DO BILHETE DIGITADO
    const response = await runQuery('SELECT CREDITO FROM recarga WHERE fk_codigo_bilhete = :id order by data_e_hora_recarga desc',[req.params.cod]);
    const credito = response.rows[0].CREDITO
    
    return res.json(credito);
})


app.post('/utilizacao/tipo/:cod', async(req, res, next)=>{// RETORNA O TIPO DO BILHETE DIGITADO
    const dados = await runQuery('SELECT TIPO_RECARGA FROM recarga WHERE fk_codigo_bilhete = :id order by data_e_hora_recarga desc',[req.params.cod]);
    const tipo = dados.rows[0].TIPO_RECARGA
    return res.json(tipo);
});
app.post('/utilizacao/confirmarRecarga/:cod', async(req,res,next)=>{//VERIFICA SE A RECARGA DO BILHETE DIGITADO EXISTE
    const existeRecarga = await runQuery('SELECT count (*) as COUNT FROM recarga WHERE fk_codigo_bilhete = :id',[req.params.cod]);
    const dado = existeRecarga.rows[0].COUNT;
    return res.json(dado);
})
app.post('/utilizacao/create/:cod/:tempo', async(req, res, next)=>{//INSERE NA TABELA UTILIZACAO E FAZ O UPDATE DA RECARGA
    var data = new Date();
    var dataUtilizacao = formatarData(data);
    const dataExpiracaoFormat = formatarData(addHoursToDate(data,req.params.tempo));
    var objeto = {"name": "1"};
    await runQuery('insert into utilizacao (FK_CODIGO_BILHETE,data_e_hora_utilizacao,data_e_hora_expiracao ) values(:id,:id,:id)',[req.params.cod,dataUtilizacao,dataExpiracaoFormat]);
    const dados = await runQuery('SELECT CODIGO_RECARGA,CREDITO FROM recarga WHERE fk_codigo_bilhete = :id order by data_e_hora_recarga desc',[req.params.cod]);
    const credito = dados.rows[0].CREDITO;
    const codigoRecarga = dados.rows[0].CODIGO_RECARGA;
    if(credito === 2){
        await runQuery('UPDATE recarga SET CREDITO = 1 WHERE CODIGO_RECARGA = :id',[codigoRecarga]);
    }else{
        await runQuery('UPDATE recarga SET CREDITO = 0 WHERE CODIGO_RECARGA = :id',[codigoRecarga]);
    }
    return res.json(objeto.name);
})

app.post('/utilizacao/dataEx/:cod', async(req, res, next)=>{
    const dados = await runQuery('SELECT (DATA_E_HORA_EXPIRACAO)  FROM UTILIZACAO WHERE fk_codigo_bilhete = :id order by ID_UTILIZACAO desc',[req.params.cod]);
    data = new Date();
    var objeto = {"name": "1"};
    const dataexpiracao = dados.rows[0].DATA_E_HORA_EXPIRACAO 
    
    if(dataexpiracao - data <= 0){
        return res.json(objeto.name);

    }else{
        objeto = {"name": "0"}
        return res.json(objeto.name);
    }
    

})
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
app.post('/gerenciamento/:cod', async  (req, res) => {
    var array = [];
    var referencia = {
        "tipo":"",
        "data_geracao":"",
        "data_recarga":"",
        "data_utilizacao":"",
    }
    const selecJoin = await runQuery("select tipo_recarga as TIPO,data_geracao as DATA_GERACAO,data_e_hora_recarga AS DATA_RECARGA,data_e_hora_utilizacao as DATA_UTILIZACAO from bilhetes join recarga on bilhetes.codigo_bilhete = recarga.fk_codigo_bilhete join utilizacao on bilhetes.codigo_bilhete = utilizacao.fk_codigo_bilhete where codigo_bilhete = :id",[req.params.cod]);
    
    for(i in selecJoin.rows){
        referencia={}
        referencia.tipo = selecJoin.rows[i].TIPO;
        referencia.data_geracao = formatarData(selecJoin.rows[i].DATA_GERACAO)
        referencia.data_recarga = formatarData(selecJoin.rows[i].DATA_RECARGA)
        referencia.data_utilizacao = formatarData(selecJoin.rows[i].DATA_UTILIZACAO)
        array.push(referencia)
    }
    return res.json(array);

})
app.post('/recarga/validacao/:cod',async(req, res)=>{
    const existe = await runQuery('SELECT COUNT (*) AS COUNT FROM RECARGA WHERE fk_codigo_bilhete = :id',[req.params.cod]);
    const contar = existe.rows[0].COUNT;
    if (contar !=0){
        const credito = await runQuery('select CREDITO from RECARGA WHERE fk_codigo_bilhete = :id',[req.params.cod]);
        const creditoR = credito.rows[0].CREDITO
        return res.json(creditoR);
    }else{
        return res.json(contar);
    }
})




app.listen(8080, function(){
    console.log("Está no ar!");
});

