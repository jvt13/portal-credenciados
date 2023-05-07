const mongoose = require('mongoose');
var data_base = "portal_solicitacao";
var Schema = mongoose.Schema;
var table = null;

//function conexao() {
    mongoose.connect('mongodb+srv://root:102030@cluster0.jaybk0n.mongodb.net/' + data_base + '?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
        console.log('Conectado ao MongoDB com sucesso! ' + data_base);
        global.status_bd = "conectado";
    }).catch(function (err) {
        console.log(err.message);
        global.status_bd = "desconectado";
    });
//}

table = new Schema({
    nome: String,
    cnpj: String,
    luc: String
},{collection:'lojas'});

var lojas = mongoose.model("lojas", table);

table = new Schema({
    nome: String,
    cpf: String,
    rg: String,
    org_emissor: String,
    tel: String,
    cel: String,
    ocupacao: String,
    cep: String,
    bairro: String,   
    cidade: String,
    uf: String,
    rua: String,
    numero: String,
    complemento: String,
    loja: String,
    plano: String,
    tipo_credencial: String,
    assinatura1: String,
    assinatura2: String,
    status: String,
    status2: String,
    veiculo:String,
    marca:String,
    modelo:String,
    ano:String,
    cor:String,
    placa:String,
    dta_solicitacao: String,
    hora_solicitacao: String,
    assinatura_baixa: String,
    dta_baixa: String

},{collection:'solicitacao'});

var solicitacao = mongoose.model("solicitacao", table); 

table = new Schema({
    nome: String,
    valor: String,
    tipo: String,
    mod: String
},{collection:'tipo_credencial'});

var tipo_credencial = mongoose.model("tipo_credencial", table);

table = new Schema({
    grupo: String,
    valor: String
},{collection:'valor_segundavia'});

var valor_segundavia = mongoose.model("valor_segundavia", table);

table = new Schema({
    msg: String
},{collection:'inf_segundavia'});

var inf_segundavia = mongoose.model("inf_segundavia", table);

table = new Schema({
    cpf_cnpj: String,
    img1: String,
    img2: String,
    img3: String,
    img4: String
}, { collection: 'uploads' });

var uploads = mongoose.model("uploads", table);

table = new Schema({
    cpf: String,
    tipo: String
}, { collection: 'historico_solicitacao' });

var historico_solicitacao = mongoose.model("historico_solicitacao", table);

table = new Schema({
    cpf: String,
    tipo: String
}, { collection: 'hist_atualizacao_cred' });

var hist_atualizacao_cred = mongoose.model("hist_atualizacao_cred", table);

table = new Schema({
    mens_part1: String,
    mens_obj_part1: String

}, { collection: 'inf_contrato' });

var inf_contrato = mongoose.model("inf_contrato", table);

module.exports = { mongoose, lojas, solicitacao, tipo_credencial, uploads, valor_segundavia, inf_segundavia, historico_solicitacao, hist_atualizacao_cred, inf_contrato };