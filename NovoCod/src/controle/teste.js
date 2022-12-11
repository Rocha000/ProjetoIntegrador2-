require ('./corinthians');

function formatarData (data) {
    var dataString = data.getDate()  + "/" + (data.getMonth()+1) + "/" + data.getFullYear() + " " +
    data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    return dataString;
  }

  var objGerenciamento = {"tipo":"","dataGeracao":"","dataRecarga":"","dataUtilizacao":""};
  
module.exports = async function testeHora(codigo){
    // const existe = await runQuery('select (datageracao_bilhete) from Bilhetes where codigo_bilhete = :id',[codigo]);
    
    const existe = await runQuery(
        `select
            codigo_bilhete as COD,
            tipo_recarga as TIPO,
            datageracao_bilhete as DATA_GERARACAO,
            data_recarga AS DATA_RECARGA,
            dataativacao_bilhete as DATA_UTILIZACAO
            from bilhetes join recarga on bilhetes.codigo_bilhete = recarga.fk_codigo_bilhete
            join utilizacao on bilhetes.codigo_bilhete = utilizacao.fk_codigo_bilhete
            where codigo_bilhete = :id`,[codigo]);
    
    // console.log(existe.rows);
    for (var i = 0; i < 4;i++){
        // console.log(existe.rows[i]);
        objGerenciamento.tipo = existe.rows[i].TIPO;
        objGerenciamento.dataGeracao = formatarData(existe.rows[i].DATA_GERARACAO);
        objGerenciamento.dataRecarga = formatarData(existe.rows[i].DATA_RECARGA);
        objGerenciamento.dataUtilizacao = formatarData(existe.rows[i].DATA_UTILIZACAO);
        console.log(objGerenciamento); // aqui deveria mandar pro front 
    }
    // console.log(formatarData(existe.rows[0].DATA_GERARACAO));
    // console.log(formatarData(existe.rows[0].DATA_RECARGA));
    // console.log(formatarData(existe.rows[0].DATA_UTILIZACAO));
    // objGerenciamento.tipo = existe.rows[0].TIPO;
    // objGerenciamento.dataGeracao = formatarData(existe.rows[0].DATA_GERARACAO);
    // objGerenciamento.dataRecarga = formatarData(existe.rows[0].DATA_RECARGA);
    // objGerenciamento.dataUtilizacao = formatarData(existe.rows[0].DATA_UTILIZACAO);
    // console.log(objGerenciamento);

}