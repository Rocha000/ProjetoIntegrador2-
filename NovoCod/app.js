const express = require('express');
const app = express();
require('./src/controle/executarBD')
require('./src/controle/teste')
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
    res.sendFile(__dirname + "/GerenciamentoBilhete.html");
});


app.post("/", function(req,res){
    res.sendFile(__dirname + "/src/paginas/TelaInicial.html");
});
app.post("/Recarga", function(req,res){
    res.sendFile(__dirname + "/src/paginas/Recarga.html");
});
app.post("/GeracaoBilhete", function(req,res){
    res.sendFile(__dirname + "/src/paginas/GeracaoBilhete.html");
});
  
app.post("/bilhetes/create/:cod", async (req,res,next)=>{
    await runQuery('insert into bilhetes (codigo_bilhete, data_compra) values(:id, sysdate)',[req.params.cod]);
});


app.post("/codrecarga/create/:cod/:tipo/:valor", async (req,res,next)=>{
    // const existe = await runQuery('SELECT count (*)  FROM bilhetes WHERE codigo_bilhete = :id',[req.params.cod]);
    // const comparacao = '{"COUNT(*)":1}';
    // if (JSON.stringify(existe.rows[0]) == comparacao){
    //     await runQuery('insert into recarga (FK_CODIGO_BILHETE,VALOR_BILHETE, data_recarga,tipo_recarga) values(:id,:id, sysdate,:id)',
    //     [req.params.cod, req.params.valor, req.params.tipo]);
    //     return res.json(existe.rows[0]);
    // }else{
    //     return res.json(existe.rows[0]);
    // }
    const existe = await runQuery('SELECT count (*) as COUNT FROM bilhetes WHERE codigo_bilhete = :id',[req.params.cod]);
    const data = existe.rows[0].COUNT;
    if (data === 1){
        await runQuery('insert into recarga (FK_CODIGO_BILHETE,VALOR_BILHETE, data_recarga,tipo_recarga) values(:id,:id, sysdate,:id)',
        [req.params.cod, req.params.valor, req.params.tipo]);
        return res.json(existe.rows[0]);
    }else{
       return res.json(existe.rows[0]);
    }
});
app.post('/utilizacao/create/:cod/:tipo/:datageracao/:dataExpiracao', async(req, res, next)=>{
    await runQuery('insert into utilizacao (FK_CODIGO_BILHETE,tipo_bilhete, data_utilizacao ,expiracao_utilizacao) values(:id,:id, :id,:id)',[req.params.cod, req.params.tipo, req.params.datageracao,req.params.dataexpiracao]);
    const {codigo, tipo, valor} = await runQuery('SELECT FK_CODIGO_BILHETE,TIPO_RECARGA, VALOR_BILHETE FROM RECARGA WHERE FK_CODIGO_BILHETE = :id',[req.params.cod]);
    if(tipo == 'duplo' && valor == 9.5){
        await runQuery('UPDATE recarga SET VALOR_BILHETE = 4.7 WHERE FK_CODIGO_BILHETE = :id',[req.params.cod]);
    }else{
        await runQuery('UPDATE recarga SET VALOR_BILHETE = 0 WHERE FK_CODIGO_BILHETE = :id',[req.params.cod]);
    }
});

app.listen(8080, function(){
    console.log("Está no ar!");
});

// const existe = await teste('SELECT data_compra FROM bilhetes');
//     const data = existe.rows[0].DATA_COMPRA;                            // a DbObject for the named Oracle type
//     console.log(data);