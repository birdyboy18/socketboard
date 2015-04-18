var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var fs = require('fs');
var serveStatic = require('serve-static');

var router = express.Router();

router.get('/', function(req,res){
  res.redirect('/public/soundBoard.html');
});

/*
make it so that an array of sounds are sent over so we can
dymaically create them on an ajax request from a served file
*/
router.get('/sounds', function(req,res){
  fs.readdir('./sounds/', function(err, files){
    var sounds = [];
    files.map(function(file){
      //remove extensions and hyphens
      var title = file.replace(/(\s*\d*\.[a-zA-Z0-9]+)/g, '');
      title = title.replace(/-/g, ' ');
      title = title.replace('_', ':');
      sounds.push({
        title: title,
        file: file,
      });
    });
    res.json(sounds);
  });
});

var soundlist;
io.on('connection', function(socket){
  socket.emit('welcome', {'message': 'Hello Client' });

  if (soundlist) {
    socket.emit('soundlist', soundlist);
  }

  socket.on('soundlist', function(data){
      soundlist = data;
      io.emit('soundlist', soundlist);
  });

  socket.on('sound', function(data){
    io.emit('sound', data);
  });
});

app.use('/',router);

app.use('/public/', serveStatic(path.join(__dirname, '/public/')));
app.use('/sounds/', serveStatic(path.join(__dirname, '/sounds/')));

app.set('port', process.env.PORT || 2000);
app.set('json spaces', 2);

server.listen(app.get('port'), function(){
  console.log('Server has started listening on port ' + app.get('port'));
});
