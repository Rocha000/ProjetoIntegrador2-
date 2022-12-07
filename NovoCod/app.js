const express = require('express');
const app = express();
require('./src/controle/executarBD')


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
    await runQuery('insert into recarga (FK_CODIGO_BILHETE,VALOR_BILHETE, data_recarga,tipo_recarga) values(:id,:id, sysdate,:id)',
    [req.params.cod, req.params.valor, req.params.tipo]);
});

app.listen(8080, function(){
    console.log("Está no ar!");
});