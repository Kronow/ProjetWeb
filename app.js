var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./views/page.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);



io.sockets.on('connection', function (socket) {
    

    socket.on('getDocument', function(path) {
	// reprise des dossiers
	var file = [];
	var directory = [];
	var chemin = "./static";

	if(path !== "." || path !== "./"){
    	    chemin = path;
	}

    	fs.readdirSync(chemin).forEach(name => {
	    if(fs.lstatSync(chemin+"/"+name).isDirectory() ) directory.push(name);
	    else file.push(name);
    	});

	socket.emit('file', file);
	socket.emit('directory', directory);
    });




    socket.on('deletefile', function(path, name) {
        var c = path+'/'+name;
        console.log(c);
        fs.unlinkSync(c);
    });



    socket.on('adddirectory', function(path, newdirectory) {
    	if (newdirectory != '') {
	    if(!fs.existsSync(path+"/"+ newdirectory)) fs.mkdirSync(path+"/"+ newdirectory);  
    	}
    });



    socket.on('deletedirectory', function(path, name) {
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


    socket.on('addfile', function(path, file) {
		// parcours de tous les fichier
		for(var i =0; i< file.length; i++){
			//Ajout
			var c = path+'/'+file[i].name;
			fs.writeFileSync(c, file[i]);
		}
    });





});


server.listen(8080);