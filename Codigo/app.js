const express = require('express');
const app = express();
const inserirCod = require("./inserirBD")

app.use(express.static(__dirname + "/src"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/TelaInicial.html");
});

app.post("/", function(req,res){
  res.sendFile(__dirname + "/TelaInicial.html");
});
app.post("/GeracaoBilhete", function(req,res){
  res.sendFile(__dirname + "/GeracaoBilhete.html");
});
app.post("/Recarga", function(req,res){
  res.sendFile(__dirname + "/Recarga.html");
});

app.post("/bilhetes/create/:cod", async (req,res,next)=>{
  await inserirCod(req.params.cod);
})

app.listen(8081, function(){
  console.log("Está no ar!");
});