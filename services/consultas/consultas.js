const con = require('../conexao')

async function consultaLoja() {
    //let ret = null;
    let retorno = "";
    let ret = await con.lojas.find().exec(async function (err, list_lojas) {
        retorno = await list_lojas.map(async function (val) {
            return {
                nome: val.nome,
                cnpj: val.cnpj,
                luc: val.luc
            }
        });
        
        console.log(retorno.length);
        return "RET"
        //return await retorno;
        
        //console.log("TIPOs:"+lojas);
        //return await retLista;
        //lojas = list_lojas;
    });

    
}

/*const consulta =  con.lojas.find().exec( function (err, list_lojas) {
    list_lojas = list_lojas.map( function (val) {
        return {
            nome: val.nome,
            cnpj: val.cnpj,
            luc: val.luc
        }
    });
    console.log("Const:"+list_lojas.length)
    
    //console.log("TIPOs:"+lojas);
    //return await retLista;
    //lojas = list_lojas;
});*/

module.exports = { consultaLoja }