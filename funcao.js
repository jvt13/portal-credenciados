let request = require('request');
let cep = require('cep-promise');
//import cep from 'cep-promise';

async function CEP(valor) {
    var ret = null;
    cep(valor).then((result) => {
        //console.log(result)
        ret = result;
        global.result;
    }).catch((err) => {
        console.log(err);
    });

    //return ret;
}

let dados = "";

function resolveAfter2Seconds(x) {
    const ret = null;
    return new Promise(resolve => {
        setTimeout(() => {
            cep(x).then((result) => {
                //console.log(result)
                ret = result;
                resolve(result);
                console.log(result);
                global.result;
            }).catch((err) => {
                console.log(err);
            });
            //resolve(ret);
        }, 2000);
    });
}

async function Reg() {
    var x = await resolveAfter2Seconds(10);
    console.log(x); // 10

    //return x;

}

async function buscaCEP(valor) {

    var url = "https://viacep.com.br/ws/" + valor + "/json/";
    console.log("Para:" + url);

    request(url, function (err, response, body) {

        if (err) {
            console.log('error:', err);
        } else {
            let info = JSON.parse(body);
            dados = [{
                cep: `${info.cep}`,
                rua: `${info.logradouro}`,
                complemento: `${info.complemento}`,
                bairro: `${info.bairro}`,
                cidade: `${info.localidade}`,
                uf: `${info.uf}`
            }];
        }
        return dados;
    });

    console.log("Dentro do request222:" + dados.length + "|" + dados.cidade);
    //return dados;
    return await Promise.resolve(dados);
}

module.exports = { buscaCEP, CEP, Reg, dados }