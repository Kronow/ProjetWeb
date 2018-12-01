var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affich� au client
var server = http.createServer(function(req, res) {

    fs.readFile('./views/page.html', 'utf-8', function(error, content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
        
});

// Chargement de socket.io
var io = require('socket.io').listen(server);



io.sockets.on('connection', function (socket) {
	
	// FileManager.js --> Class js // Gestion des fichier

	/**
	 * Reprise des documents et Fichiers du chemin
	 */
    socket.on('getDocument', function(path) {
		var file = [];
		var folder = [];
		var chemin = "./static";

		if(path !== "." || path !== "./"){
				chemin = path;
		}

		fs.readdirSync(chemin).forEach(name => {
			if(fs.lstatSync(chemin+"/"+name).isDirectory() ) folder.push(name);
			else file.push(name);
		});
		socket.emit('file', file);
		socket.emit('folder', folder);
    });



	/**
	 * Supprime le fichier
	 */
    socket.on('deletefile', function(path, name) {
        var c = path+'/'+name;
        fs.unlinkSync(c);
    });


	/**
	 * Ajoute un dossier
	 */
    socket.on('addfolder', function(path, newfolder) {
    	if (newfolder != '') {
	    	if(!fs.existsSync(path+"/"+ newfolder)) fs.mkdirSync(path+"/"+ newfolder);  
    	}
    });


	/**
	 * Supprime le dossier (si vide)
	 */
    socket.on('deletefolder', function(path, name) {
		var bool = true;
    	if (name != '') {
	    c = path+'/'+name;

	    if(fs.existsSync(c)){
	    	fs.readdirSync(c).forEach(function(file){
		    	if(file) bool = false;
	    	});

	        if(bool) fs.rmdirSync(c);
	    }
    	}
    });


	/**
	 * Ajoute un fichier 
	 */
    socket.on('addfile', function(path, file) {
		
		for(var i =0; i< file.length; i++){
			var c = path+'/'+file[i].name;
			fs.writeFileSync(c, file[i]);
		}
    });





});


server.listen(8080);