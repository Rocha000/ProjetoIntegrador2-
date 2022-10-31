const express = require('express');
const app = express();
const inserirCod = require("./inserirBD")

app.use(express.static(__dirname + "/src"));

//PARA DIGITAR PELO URL
app.get("/", function(req,res){
  res.sendFile(__dirname + "/TelaInicial.html");
});
app.get("/Recarga", function(req,res){
  res.sendFile(__dirname + "/Recarga.html");
});
app.get("/GeracaoBilhete", function(req,res){
  res.sendFile(__dirname + "/GeracaoBilhete.html");
});
app.get("/Carrinho", function(req,res){
  res.sendFile(__dirname + "/Carrinho.html");
});

//PARA COLOCAR NOS BOTÕES
app.post("/", function(req,res){
  res.sendFile(__dirname + "/TelaInicial.html");
});
app.post("/Recarga", function(req,res){
  res.sendFile(__dirname + "/Recarga.html");
});
app.post("/GeracaoBilhete", function(req,res){
  res.sendFile(__dirname + "/GeracaoBilhete.html");
});
app.post("/Carrinho", function(req,res){
  res.sendFile(__dirname + "/Carrinho.html");
});

app.post("/bilhetes/create/:cod", async (req,res,next)=>{
  await inserirCod(req.params.cod);
})

app.listen(8081, function(){
  console.log("Está no ar!");
});