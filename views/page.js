var path = "./static";
var parent = ".";

var socket = io.connect('http://localhost:8080');

/** 
 * Demande les fichiers et les dossiers lors du chargement de la page
*/
socket.emit('getDocument', path);

/**
 * Gestion des Déplacements dans les dossiers
*/
function getfolder(name) {
    parent = path;
    path += "/"+name;
    
    $("#return").html("<input type='button' id='returnbutton' value='Retour' onclick='returnbutton();' />");
    socket.emit('getDocument', path);
}

function returnbutton() {
    path = parent;
    parent = newParent(path);
    if(parent == ".") $("#return").html("");
    socket.emit('getDocument', path);
}

function newParent(p){
    var c = ".";
    var tab = p.split("/");
    for(var i = 1; i < (tab.length-1); i++){
        c += "/"+tab[i];
    }
    return c;
}


/*** Gestion des fichiers | Client ***/

/**
 * Affichage des fichiers
*/
socket.on('file', function(file) {
    var html = "<ul>";
    for(var i = 0; i < file.length; i++ ){
        html += "<li>"
        html += '<input type="button" value="Supprimer" onclick="deletefile(\''+file[i]+'\')"/> \t ';
        html += '<input type="button" value="'+file[i]+'" onclick="downloadfile(\''+file[i]+'\')"/> \t ';
        html += "</li>";
    }
    html += "</ul>";   
    $('#file').html(html);
});

/** 
 * Fonction telechagement du fichier
*/
function downloadfile(name){
    console.log('downloadfile : '+name);
}

/** 
 * Fonction suppression du fichier
*/
function deletefile(name){
    socket.emit('deletefile', path, name);
    socket.emit('getDocument', path);
}

            /** 
 * Stock le fichier choisi par l'utilisateur
*/
var tabfile = [];

$('#cfile').on('change', function() {
    // this.files de la balise cfile
    tabfile = this.files;
});

/** 
 * Ajoute un fichier dans le dossier
*/
$('#newfile').click(function () {
    console.log("addFile");
    socket.emit('addfile', path, tabfile);
    socket.emit('getDocument', path);
});



/*** Gestion des dossiers | Client ***/

/**
 * Affichage des dossiers
*/
socket.on('folder', function(dir) {
    var html = "<ul>";
    for(var i = 0; i < dir.length; i++ ){
        html += "<li>"
        html += '<input type="button" value="Supprimer" onclick="deletefolder(\''+dir[i]+'\');"/> \t ';
        html += '<input type="button" value="Parcourir" onclick="getfolder(\''+dir[i]+'\');"/> \t ';
        html += dir[i];
        html += "</li>";
    }
    html += "</ul>";
    $('#folder').html(html);

    //retourne '' si path='./static'
    var c = getFolder(path);
    $('#foldername').html('Dossier : '+c);
});



/**
 * Reprend le nom des dossiers parcourru
*/
function getFolder(p){
    var tab = p.split("/");
    var c = '';
    for(var i = 2; i < tab.length;i++){
        c += '/'+tab[i];
    }
    return c;
}


/**
 * Ajoute le Dossier
*/
$('#newfolder').click(function () {
    var name = $('#namefolder').val();

    if(name != "") socket.emit('addfolder', path, name);
    socket.emit('getDocument', path);

    $('#namefolder').val("");		
});


/**
 * Supprimme le dossier
*/
function deletefolder(name){
    socket.emit('deletefolder', path, name);
    socket.emit('getDocument', path);
}
