(function(){
  var soundlist;
  var hasRendered = false;

  var board = document.getElementById('board');

  var socket = io();
  socket.on('welcome', function(data){
    console.log(data);
  });
  socket.on('soundlist', function(data){
      console.log(data);
      soundlist = data;

      soundlist.map(function(sound){
        var outerDiv = document.createElement('div');
        outerDiv.setAttribute('data-id', sound.id);
        outerDiv.setAttribute('class', 'sound-outer');
        outerDiv.addEventListener('click',function(e){
          var id = this.getAttribute('data-id');
          socket.emit('sound', id);
        }, true);
        var innerDiv = document.createElement('div');
        innerDiv.setAttribute('class', 'sound');
        var text = document.createTextNode(sound.title);

        innerDiv.appendChild(text);
        outerDiv.appendChild(innerDiv);
        board.appendChild(outerDiv);
      });
  });



})();
