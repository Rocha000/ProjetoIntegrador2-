const express = require('express');
const app = express();

app.get("/", function(req,res){
  res.sendFile(__dirname + "/GeracaoBilhete.html");
});

app.listen(8081, function(){
  console.log("Está no ar!");
});