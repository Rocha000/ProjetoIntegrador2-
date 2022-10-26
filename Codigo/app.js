const express = require('express');
const app = express();
const inserirCod = require("./inserirBD")

app.use(express.static(__dirname + "/src"));
app.get("/", function(req,res){
  res.sendFile(__dirname + "/GeracaoBilhete.html");
});

app.post("/bilhetes/create/:cod", async (req,res,next)=>{
  await inserirCod(req.params.cod);
})

app.listen(8081, function(){
  console.log("Está no ar!");
});