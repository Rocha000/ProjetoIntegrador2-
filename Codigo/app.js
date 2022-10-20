function BD () {
  process.env.ORA_STDZ = 'UTC-3'; // Horário de Brasília

  this.getConexao = async function () { // função interna SEMPRE deve começar com "this"
    if (global.conexao) return global.conexao;
    const oracledb = require('oracledb');
    const dbConfig = require('./dbconfig.js');

    try{
      global.conexao = await oracledb.getConnection(dbConfig);
    }
    catch (erro){
      console.log("Não foi possível estabelecer conexão com o Banco de Dados");
      process.exit(1);
    }

    return global.conexao;
  }

  this.executarComando = async function (comando) {
    try {
      const conexao = await this.getConexao();
      const sql = comando;
      //comando = 'CREATE TABLE Livros (Codigo NUMBER(4) PRIMARY KEY)' (comando a ser executado no Oracle)
      await conexao.execute(sql);
    }
    catch(erro){
      console.log("Comando impossível de ser executado. Verifique se tudo está correto");
    }
  }
}

function Livros (bd){
  this.bd = bd;

  this.inclua = async function (livro){
    //função para adicionar livros no banco de dados "Livros"
  }
}

async function inclusao (req, res) {
  if (!req.body.codigo || !req.body.nome || !req.body.preco){
    const erro1 = new Comunicado ("DdI", "Dados incompletos", "Não foram informados dados suficientes");
    return res.status(422).json(erro1);
  }

  const livro = new Livro (req.body.codigo, req.body.nome, req.body.preco);
}

const express = require('express');
const app = express();
const bd = new BD();

await bd.estrutureSe();
global.livros = new Livros (bd);

app.get("/", function(req,res){
  res.sendFile(__dirname + "/GeracaoBilhete.html");
});

app.listen(8081, function(){
  console.log("Está no ar!");
});