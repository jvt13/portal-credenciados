const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
const ejs = require('ejs');
var funcao = require('./funcao.js');
const util = require('./services/util');
const request = require('request');
let cep = require('cep-promise');
const fs = require('fs');
const pdf = require('html-pdf');

//Banco de dados
const con = require('./services/conexao');
//Fim banco de dados

const app = express();
const porta = process.env.PORT || 5000;
let dados = null;
let ret = null;
global.dados_cep = null;

/* Definição de limite de dados de upload.*/
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/* Fim de limite de dados.*/

app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }));
/*app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));*/

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/', (req, res) => {

    global.select_loja = "";
    res.render('home');
});

app.post('/busca', (req, res) => {
    var status = null;

    con.solicitacao.find({ cpf: req.body.cpf }).exec(function (err, inf_cred) {
        inf_cred = inf_cred.map(function (val) {
            return {
                id: val._id,
                nome: val.nome.toUpperCase(),
                cpf: val.cpf,
                loja: val.loja.toUpperCase(),
                dta_solicitacao: val.dta_solicitacao,
                hora_solicitacao: val.hora_solicitacao,
                plano: val.plano,
                tipo_credencial: val.tipo_credencial,
                status: val.status,
                status2: val.status2
            }
        });

        //console.log("Retorno:" + inf_cred.length);

        if (inf_cred.length > 0) {
            req.session.cpf = req.body.cpf;
            req.session.loja = req.body.select_loja;
            req.session.id = inf_cred[0].id;


            var valor_cred = ""
            var targ_valor = inf_cred[0].plano.split("R$");
            const filter = { mod: "Mensalista", plano: targ_valor[1] };
            const filter2 = { valor: "50" };
            con.tipo_credencial.find(filter).exec(function (err, dados_cred) {
                dados_cred = dados_cred.map(function (val) {
                    return {
                        nome: val.nome,
                        valor: val.valor,
                        tipo: val.tipo,
                        mod: val.mod
                    }
                });

                var param = targ_valor[0].split(" -")[0];
                param = param.replace(" ", "").toLowerCase();

                con.valor_segundavia.findOne({ grupo: param }).exec(function (err, ret) {
                    valor_cred = ret.valor;
                    var plano = param;

                    status = "Y";
                    global.inf_cred = inf_cred;
                    //res.redirect('/cadastro');
                    con.inf_segundavia.findOne({}).exec(function (err, msg) {
                        console.log("RET:" + msg.msg)
                        res.render('informacao_credenciado', { inf_cred: inf_cred, status: status, valor_cred: valor_cred, plano: plano, msg: msg });
                    });

                });

            });

        } else {
            inf_cred = [{
                cpf: req.body.cpf

            }];

            status = "N";
            //console.log("Id:" + req.session.id + "|CPF:" + req.session.cpf);
            global.inf_cred = inf_cred;
            //res.redirect('/cadastro');
            res.render('informacao_credenciado', { inf_cred: inf_cred, status: status });
        }

    });
    //res.render('home');
});

function formatMoney(n, c, d, t) {
    c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function trataSession(req) {

}

app.get('/cadastro-mensalista', (req, res) => {
    global.select_tipo_cred = "";

    con.lojas.find().exec(function (err, list_lojas) {
        list_lojas = list_lojas.map(function (val) {
            return {
                nome: val.nome,
                cnpj: val.cnpj,
                luc: val.luc
            }
        });

        con.tipo_credencial.find({}).exec(function (err, list_tipo) {
            list_tipo = list_tipo.map(function (val) {
                return {
                    nome: val.nome,
                    valor: val.valor,
                    tipo: val.tipo
                }
            });
            //console.log("Len:" + list_tipo.length);
            res.render('form_credencial', { list_lojas: list_lojas, list_tipo: list_tipo });
        });
    });

});

app.get('/cadastro-mensalista/:p', (req, res) => {
    var parametro = req.params.p;
    var tipo_targ;

    if (parametro == "Mensalista") {
        global.select_tipo_cred = "Lojista"
        tipo_targ = "lojista";
    } if (parametro == "Unic") {
        tipo_targ = "Unic"
        global.select_tipo_cred = "Aluno Unic"
    }

    //console.log("Tipo:"+tipo_targ+"|"+ parametro);


    con.lojas.find().exec(function (err, list_lojas) {
        list_lojas = list_lojas.map(function (val) {
            return {
                nome: val.nome,
                cnpj: val.cnpj,
                luc: val.luc
            }
        });

        con.tipo_credencial.find({ tipo: tipo_targ }).exec(function (err, list_tipo) {
            list_tipo = list_tipo.map(function (val) {
                return {
                    nome: val.nome,
                    valor: val.valor,
                    tipo: val.tipo,
                    mod: val.mod
                }
            });
            //console.log("Tipo:"+global.select_tipo_cred);
            //console.log("Len:" + list_tipo.length);
            res.render('form_credencial', { list_lojas: list_lojas, list_tipo: list_tipo, tipo: global.tipo });
        });

    });

});

app.post('/cadastro-mensalista/', (req, res) => {
    //con.conexao();
    var dta = new Date();

    con.solicitacao.create({
        nome: "" + req.body.nome.toUpperCase(),
        cpf: "" + req.body.cpf.toUpperCase(),
        rg: "" + req.body.rg.toUpperCase(),
        org_emissor: "" + req.body.org_emissor.toUpperCase(),
        tel: "" + req.body.tel,
        cel: "" + req.body.cel,
        ocupacao: "" + req.body.ocupacao.toUpperCase(),
        cep: "" + req.body.end_cep,
        bairro: "" + req.body.end_bairro.toUpperCase(),
        cidade: "" + req.body.end_cidade.toUpperCase(),
        uf: "" + req.body.end_uf.toUpperCase(),
        rua: "" + req.body.end_rua.toUpperCase(),
        numero: "" + req.body.end_numero.toUpperCase(),
        complemento: "" + req.body.end_complemento.toUpperCase(),
        loja: "" + req.body.select_loja.toUpperCase(),
        tipo_credencial: "" + req.body.select_tipo_cred.toUpperCase(),
        plano: "" + req.body.select_tipo_plano.toUpperCase(),
        assinatura1: "" + req.body.assinatura1,
        assinatura2: "" + req.body.assinatura2,
        status: "PENDENTE",
        status2: "",
        veiculo: "" + req.body.select_veiculo,
        marca: "" + req.body.marca,
        modelo: "" + req.body.modelo,
        ano: "" + req.body.ano,
        cor: "" + req.body.cor,
        placa: "" + req.body.placa,
        dta_solicitacao: "" + util.dataAtualFormatada(),
        hora_solicitacao: "" + dta.getHours() + ":" + dta.getMinutes()

    });

    const filter = { cpf: req.session.cpf };
    const query = { status2: 'DESATIVAR' };

    con.solicitacao.find(filter).exec(function (err, ret) {
        ret = ret.map(function (val) {
            return {
                cpf: val.cpf
            }
        });

        if (ret.length > 0) {
            con.solicitacao.findOneAndUpdate(filter, query, { upsert: true }, function (err, doc) {
                console.log("UPDATE:");
            });
        }
    });

    con.uploads.create({
        cpf_cnpj: "" + req.body.cpf,
        img1: "" + req.body.img_1,
        img2: "" + req.body.img_2,
        img3: "" + req.body.img_3,
        img4: "" + req.body.img_4
    });

    global.inf_cred = null;
    req.session = null;
    res.redirect('/');
});

app.get('/cadastro-autorizada', (req, res) => {
    global.select_tipo_cred = "";

    con.lojas.find().exec(function (err, list_lojas) {
        list_lojas = list_lojas.map(function (val) {
            return {
                nome: val.nome,
                cnpj: val.cnpj,
                luc: val.luc
            }
        });
        //console.log("Len:" + list_lojas.length);
        //res.render('form_credencial', { list_lojas: list_lojas, list_tipo: list_tipo });
        res.render('form-autorizada', { list_lojas: list_lojas });
    });
});

const generatePDF = (req, res) => {

    const html = fs.readFileSync('E:\\Web\\controle_solicitacao\\pages\\home.html', 'utf8');

    const options = {
        type: 'pdf',
        format: 'A4',
        orientation: 'portrait'
    }

    pdf.create(html, options).toFile('./pdf-gerado.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    res.redirect('./');
}

app.post('/cadastro-autorizada2222', generatePDF);

app.post('/cadastro-autorizada', (req, res) => {
    var dta = new Date();

    con.solicitacao.create({
        nome: "" + req.body.nome.toUpperCase(),
        cpf: "" + req.body.cpf.toUpperCase(),
        rg: "" + req.body.rg.toUpperCase(),
        org_emissor: "" + req.body.org_emissor.toUpperCase(),
        tel: "" + req.body.tel,
        cel: "" + req.body.cel,
        ocupacao: "" + req.body.ocupacao.toUpperCase(),
        cep: "" + req.body.end_cep,
        bairro: "" + req.body.end_bairro.toUpperCase(),
        cidade: "" + req.body.end_cidade.toUpperCase(),
        uf: "" + req.body.end_uf.toUpperCase(),
        rua: "" + req.body.end_rua.toUpperCase(),
        numero: "" + req.body.end_numero.toUpperCase(),
        complemento: "" + req.body.end_complemento.toUpperCase(),
        loja: "" + req.body.select_loja.toUpperCase(),
        tipo_credencial: "AUTORIZADA",
        plano: "",
        assinatura1: "" + req.body.assinatura1,
        assinatura2: "" + req.body.assinatura2,
        status: "PENDENTE",
        status2: "",
        veiculo: "" + req.body.select_veiculo,
        marca: "" + req.body.marca,
        modelo: "" + req.body.modelo,
        ano: "" + req.body.ano,
        cor: "" + req.body.cor,
        placa: "" + req.body.placa,
        dta_solicitacao: "" + util.dataAtualFormatada(),
        hora_solicitacao: "" + dta.getHours() + ":" + dta.getMinutes()

    });
});

app.post('/status', (req, res) => {
    const lista = null;

    con.solicitacao.findOne({ cpf: req.body.cpf }).exec(function (err, list) {
        /*list = list.map(function (val) {
            return {
                nome: val.nome,
                cpf: val.cpf,
                status: val.status
            }
        });*/
        res.render('status_credenciado', { list: list });
        //res.send("Status:" + list[0].status);
    });
});



function geraPDF(html) {
    const options = {
        type: 'pdf',
        format: 'A4',
        orientation: 'portrait'
    };

    pdf.create(html, options).toFile("./meupdf.pdf", (err, res) => {
        if (err) {
            console.log("OCORREU UM ERRO!");
        } else {
            console.log(res);
        }
    })
}

app.get('/status/baixar-contrato', (req, res) => {
    //var targ_valor = inf_cred[0].plano.split("R$");
    con.solicitacao.findOne({ cpf: '03287559150' }).exec((err, credenciado) => {
        con.inf_contrato.findOne({}).exec((err, list) => {
            var targ_valor = credenciado.plano.split("-");

            ejs.renderFile("./pages/contrato.ejs", { credenciado, list, targ_valor }, (err, html) => {
                if (err) {
                    console.log("Err: " + err);
                } else {
                    //console.log(html);
                    geraPDF(html);
                    res.send(html)
                }
            });
        });
    });
    //res.send("Baixar contrato");
    //res.render('contrato')
});

app.get('/busca/segundavia', (req, res) => {
    res.render('form-2via');
});

async function consultaLoja() {
    const ret = await con.lojas.find().exec(async function (err, list_lojas) {
        const retLista = await list_lojas.map(async function (val) {
            return {
                nome: val.nome,
                cnpj: val.cnpj,
                luc: val.luc
            }
        });
        //console.log("TIPOs:"+lojas);
        return await retLista;
        //lojas = list_lojas;
    });
    return await ret;
}

app.post('atualizacao-mensalista', (req, res) => {
    var dta = new Date();

    const filter = { cpf: req.session.cpf };
    const query = {
        nome: "" + req.body.nome.toUpperCase(),
        cpf: "" + req.body.cpf.toUpperCase(),
        rg: "" + req.body.rg.toUpperCase(),
        org_emissor: "" + req.body.org_emissor.toUpperCase(),
        tel: "" + req.body.tel,
        cel: "" + req.body.cel,
        ocupacao: "" + req.body.ocupacao.toUpperCase(),
        cep: "" + req.body.end_cep,
        bairro: "" + req.body.end_bairro.toUpperCase(),
        cidade: "" + req.body.end_cidade.toUpperCase(),
        uf: "" + req.body.end_uf.toUpperCase(),
        rua: "" + req.body.end_rua.toUpperCase(),
        numero: "" + req.body.end_numero.toUpperCase(),
        complemento: "" + req.body.end_complemento.toUpperCase(),
        loja: "" + req.body.select_loja.toUpperCase(),
        /*tipo_credencial: "AUTORIZADA",*/
        /*plano: "",*/
        assinatura1: "" + req.body.assinatura1,
        assinatura2: "" + req.body.assinatura2,
        /*status: "PENDENTE",
        status2: "",*/
        veiculo: "" + req.body.select_veiculo,
        marca: "" + req.body.marca,
        modelo: "" + req.body.modelo,
        ano: "" + req.body.ano,
        cor: "" + req.body.cor,
        placa: "" + req.body.placa,
        dta_solicitacao: "" + util.dataAtualFormatada(),
        hora_solicitacao: "" + dta.getHours() + ":" + dta.getMinutes()
    };

    con.solicitacao.findOneAndUpdate(filter, query, { upsert: true }, function (err, doc) {
        //console.log("UPDATE:");
    });
});

const consulta = require('./services/consultas/consultas');
const { query } = require('express');
const { Console } = require('console');
app.get('/atualizacao-mensalista', (req, res) => {
    global.select_tipo_cred = "";
    var lojas = null;
    let tipo_cred = null;

    con.lojas.find().exec(function (err, list_lojas) {
        list_lojas = list_lojas.map(function (val) {
            return {
                nome: val.nome,
                cnpj: val.cnpj,
                luc: val.luc
            }
        });

        con.tipo_credencial.find({}).exec(function (err, list_tipo) {
            list_tipo = list_tipo.map(function (val) {
                return {
                    nome: val.nome,
                    valor: val.valor,
                    tipo: val.tipo
                }
            });

            const filter = { cpf: req.session.cpf }
            con.solicitacao.findOne(filter).exec(function (err, dados) {
                /*dados = dados.map(function (val) {
                    return {
                        nome: val.nome,
                        cpf: val.cpf,
                        rg: val.rg,
                        org_emissor: val.org_emissor,
                        tel: val.tel,
                        cel: val.cel,
                        ocupacao: val.ocupacao,
                        cep: val.cep,
                        bairro: val.bairro,
                        cidade: val.cidade,
                        uf: val.uf,
                        rua: val.rua,
                        numero: val.numero,
                        complemento: val.complemento,
                        loja: val.loja,
                        tipo_credencial: val.tipo_credencial,
                        plano: val.plano,
                        assinatura1: val.assinatura1,
                        assinatura2: val.assinatura2,
                        status: val.status,
                        status2: val.status2,
                        dta_solicitacao: val.dta_solicitacao,
                        hora_solicitacao: val.hora_solicitacao
                    }
                });*/
                //console.log("Len:" + dados.length);
                //res.render('form-atualizacao', { list: list });
                res.render('form-atualizacao', { list_lojas: list_lojas, list_tipo: list_tipo, dados: dados });
            });
        });
    });

});

app.get('/busca/pausar-ativar/:stts', (req, res) => {
    var status = req.params.stts;
    if (status == 'a') {
        status = 'ATIVAR';
    }
    if (status == 'p') {
        status = 'PAUSAR';
    }

    const filter = { cpf: req.session.cpf };
    const query = { status2: status };
    con.solicitacao.findOneAndUpdate(filter, query, { upsert: true }, function (err, doc) {
        //console.log("UPDATE:");
    });
    res.redirect('../../')
});

app.post('/solicitacao/segundavia', (req, res) => {

    const filter = { cpf: req.session.cpf };
    const query = { status2: '2º VIA' };
    con.solicitacao.findOneAndUpdate(filter, query, { upsert: true }, function (err, doc) {
        //console.log("UPDATE:");
    });
    res.redirect('../')
});

//-----Back End-------------------
app.get('/gestao', (req, res) => {
    var dta_atual = util.dataAtualFormatada();

    var filter = { status: "PENDENTE" };
    con.solicitacao.find(filter).exec(function (err, list) {
        list = list.map(function (val) {
            var calc_dta_limite = util.retDtaLimite(val.dta_solicitacao, 2);
            var dif = util.calculaDiferenca(val.dta_solicitacao, dta_atual)
            //console.log("Dif: " + dif)
            var status_soli = "";

            if (dif > 2) {
                status_soli = "ATRASADO";
            }
            if (dif >= 0 && dif <= 2) {
                status_soli = "PENDENTE";
            }
            return {
                id: val._id,
                nome: val.nome,
                cpf: val.cpf,
                dta_solicitacao: val.dta_solicitacao,
                dta_limite: calc_dta_limite,
                status: val.status,
                status1: status_soli,
                status2: val.status2
            }
        });
        res.render('./gestao/home_gestao', { list: list });
    });

});

app.post('/gestao/update', (req, res) => {
    console.log("Valor do POST: " + req.body.id);
    var id = req.body.id;
    var dados = req.body.data;
    var status = req.body.status;
    var data = new Date()

    const filter = { _id: id };
    const query = { assinatura_baixa: dados, status: status };
    con.solicitacao.findOneAndUpdate(filter, query, { upsert: true }, function (err, doc) {
        if (err) {
            console.log(err.message);
        } if (doc) {
            console.log("Updade!!!");
            //setInterval(atualizarTabela, 5000); // atualizar a cada 5 segundos, por exemplo
            //return res.redirect('/');
        }
    });
});

app.post('/gestao', (req, res) => {
    var dta_atual = util.dataAtualFormatada();
    var status = req.body.status;
    var filter = { status: req.body.filter }

    console.log("|" + filter.status + "|");
    if (filter.status == "") {
        filter = {};
    }
    if (filter != undefined) {
        req.session.status = filter;
        //var filter = { status: status };
    } else {
        status = req.session.status;
        if (status != undefined) {
            //filter = { status: status };
        } else {
            //filter = { status: "PENDENTE" };
        }
    }

    con.solicitacao.find(filter).exec(function (err, list) {
        if (list) {
            list = list.map(function (val) {
                var calc_dta_limite = util.retDtaLimite(val.dta_solicitacao, 2);
                var dif = util.calculaDiferenca(val.dta_solicitacao, dta_atual)
                //console.log("Dif: " + dif)
                var status_soli = "";

                if (dif > 2) {
                    status_soli = "ATRASADO";
                }
                if (dif >= 0 && dif <= 2) {
                    status_soli = "PENDENTE";
                }
                return {
                    id: val._id,
                    nome: val.nome,
                    cpf: val.cpf,
                    dta_solicitacao: val.dta_solicitacao,
                    dta_limite: calc_dta_limite,
                    status: val.status,
                    status1: status_soli,
                    status2: val.status2
                }
            }
            );
        }
        //res.render('./gestao/home_gestao', { list:list });
        //res.send({valor})
        res.json({ list: list });
    });
});

function atualizarTabela() {
    console.log("Teste");
}

//----Fim Back End---------------
app.listen(porta, () => {
    console.log('server rodando na porta ' + porta);
});