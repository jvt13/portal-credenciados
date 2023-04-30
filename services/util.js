const crypto = require('crypto');

function encrypt(key, data) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    console.log("Criptografia concluida!");
    return crypted;
}

function decrypt(key, data) {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    console.log("Descriptografia concluida!");
    return decrypted;
}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString().padStart(2, '0'),
        mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
}

function formatDataBR(dta) {
    const date = new Date(dta);
    var formatedDate = date.toLocaleDateString({
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    //console.log(formatedDate)

    return formatedDate;
}

function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

function retDtaLimite(dta, dias) {
    // Crie uma string com a data no    formato "dd/MM/yyyy"
    const dataString = dta;
    // Separe o dia, mês e ano da string
    const [dia, mes, ano] = dataString.split("/");
    // Crie um objeto Date com a data
    const data = new Date(ano, mes - 1, dia);
    
    // Adicione dois dias à data
    data.setDate(data.getDate() + dias);
    
    // Crie uma string com a nova data no formato "dd/MM/yyyy"
    const novaDataString = `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()}`;
    //console.log("Nova data: "+ novaDataString)
    return novaDataString;
}

function calculaDiferenca(data1, data2){
  // Converte as datas no formato "dd/MM/yyyy" em objetos do tipo Date.
  var partesData1 = data1.split("/");
  var dataObj1 = new Date(partesData1[2], partesData1[1] - 1, partesData1[0]);
  
  var partesData2 = data2.split("/");
  var dataObj2 = new Date(partesData2[2], partesData2[1] - 1, partesData2[0]);

  // Subtrai a data mais antiga da data mais recente para obter a diferença em milissegundos.
  var diferenca = dataObj2.getTime() - dataObj1.getTime();

  // Converte a diferença em milissegundos em dias.
  var dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

  return dias;
}

function preparaDataParaCalcular(data) {
    //const data = new Date(dta);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // +1 pois os meses são indexados de 0
    const ano = data.getFullYear();
    const dataFormatada = `${mes}/${dia}/${ano}`;
    //console.log(dataFormatada); // saída: "03/15/2023"
    return dataFormatada;
}

module.exports = { encrypt, decrypt, formatDataBR, dataAtualFormatada, addDays, retDtaLimite, calculaDiferenca, preparaDataParaCalcular };