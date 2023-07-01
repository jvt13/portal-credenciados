const con = require('./conexao');
const util = require('./util');

async function validador(tabela) {
    const ret = await con.acionador.find({ tabela: tabela });

    if (ret.length > 0) {
        update(ret[0]._id, null);
        return;
    }

    insert(tabela);
    return "";
}

async function select(tabela) {

    const ret = await con.acionador.find({ tabela: tabela });
    
    if (ret.length > 0) {
        return ret;
    }
    return 0;
}

async function insert(tabela) {
    var dta = new Date();

    await con.acionador.create({
        tabela: tabela,
        data_hora: dta.getHours() + ":" + dta.getMinutes() + ":" + dta.getSeconds()
    });
}


async function update(id, parametro) {
    var dta = new Date();
    const filter = { _id: id };
    var query = {};
    if (parametro == null) {
        query = { data_hora: dta.getHours() + ":" + dta.getMinutes() + ":" + dta.getSeconds() };
    } else {
        query = { data_hora: "" };
    }

    const ret = await con.acionador.findOneAndUpdate(filter, query, { new: true });

    if (ret.length > 0) {
        console.log("update acionado");
    }
}

module.exports = { select, validador, update };