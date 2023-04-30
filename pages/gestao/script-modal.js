var id_assinatura = "";
var id_modal = "";
var id_dados_assinatura = "";
var id_home = "";

function openModal(mn, id, id2) {

    console.log("TESTE");
    id_dados_assinatura = id2;
    id_assinatura = id;
    id_modal = mn;
    //id_home = home;
    let modal = document.getElementById(mn);

    if (typeof modal == 'undefined' || modal == null)
        return;

    modal.style.display = 'Block';
    document.body.style.overflow = 'hidden';
    //home.style.display = 'none';
}

function closeModal(mn) {
    let modal = document.getElementById(mn);

    if (typeof modal == 'undefined' || modal == null)
        return;
    signaturePad.clear();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/*Campo assinatura*/
function download(dataURL, filename) {
    if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
        window.open(dataURL);
    } else {
        var blob = dataURLToBlob(dataURL);
        var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    }
}

function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}


var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: 'rgb(0, 0, 0)'
});

var saveButton = document.getElementById('save');
var cancelButton = document.getElementById('clear');

saveButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
        alert("Faça sua assinatura.");
    } else {
        var dataURL = signaturePad.toDataURL();
        //download(dataURL, "signature.png");
        //alert(dataURL);
        //$("#imageCheck").val(dataURL);
        document.getElementById(id_dados_assinatura).value = [dataURL];
        document.getElementById(id_assinatura).src = [dataURL];
        closeModal(id_modal);
    }
});

cancelButton.addEventListener('click', function (event) {
    signaturePad.clear();
    document.getElementById(id_assinatura).src = "";
});