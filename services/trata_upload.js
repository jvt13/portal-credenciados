function varrerUploads() {
    const lista = ['img-1', 'img-2', 'img-3'];
    var ret = false;
    const img = "";

    for (var i = 0; i < lista.length; i++) {
        img = document.getElementById(lista[i]);

        if (img.value != "") {
            ret = true;
        }
    }
    return ret;
}

function checkForm(event) {
    var file = document.getElementById('file-upload');

    /*if (file.value !== "") {
        return true;
    }*/
    if (varrerUploads) {
        var file = document.getElementById('file-upload');
        //alert("Teste:"+file.value)
        return true;
        //event.preventDefault();
    }
    alert('Falta anexar arquivos!');
    event.preventDefault();
}

function checkFile(event) {
    var file = document.getElementById('file-upload');
    var extencao = "";
    extencao = file.value.substring(file.value.lastIndexOf(".") + 1, file.value.length);
    const fileSize = file.files.item(0).size;
    const fileMb = fileSize / 1024 ** 2;
    //alert('Tamanho:' + fileMb);

    if (fileMb > 2) {
        alert('Por favor selecionar um arquivo de até 2MB!')
        file.value = "";
        return false;
    }

    if (validaExtencao(extencao)) {
        trataFile(event, file.value, file);
    } else {
        alert("Extenção de arquivo invalida!");
        file.value = "";
        return false;
    }
}

function trataFile(event, name, file) {
    const lista = ['img-1', 'img-2', 'img-3', 'img-4'];

    name = name.substring(name.lastIndexOf("\\"), name.length);
    name = name.replace("\\", "");

    let img2 = document.getElementById('img1');
    let reader = new FileReader();
    reader.onload = () => {
        img2.src = reader.result;

        for (var i = 0; i < lista.length; i++) {
            var blob = document.getElementById(lista[i]);//txt_img_1
            if (blob.value == "") {
                blob.value = reader.result;
                document.getElementById('txt_img_' + (i + 1)).value = name;
                file.value = "";
                break;
            }
        }
    }
    reader.readAsDataURL(file.files[0]);
    return true;
}

function eventoBusca() {
    const lista = ['img-1', 'img-2', 'img-3'];
    var img = "";
    for (var i = 0; i < (lista.length + 1); i++) {
        if (i >= 3) {
            alert('Os 3 arquivos necessários, já foram anexados! Se quiser trocar algum arquivo, exlua ele e anexe outro.');
            return false;
        }
        img = document.getElementById(lista[i]);

        if (img.value == "") {
            return true;
        }
    }
}
function apagarArquivo(id, id_txt) {
    document.getElementById(id).value = "";
    document.getElementById(id_txt).value = "";
}
function validaExtencao(targ) {
    const extencao = ['jpg', 'jpeg', 'png', 'pdf'];

    for (var i = 0; i < extencao.length; i++) {
        if (targ.toLowerCase() == extencao[i]) {
            return true;
        }
    }
    return false;
}