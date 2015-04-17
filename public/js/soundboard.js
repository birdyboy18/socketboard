(function(){
  var socket = io();
  var soundboard = new AudioContext();
  var bufferLoader;
  var buffList;

  //dom shiz
  var app = document.getElementById('app');

  get('http://' + window.location.host + '/sounds', function(data){
    sounds = JSON.parse(data);

    bufferLoader = new BufferLoader(soundboard, sounds, function(bufferList, recordList){
      socket.emit('soundlist', recordList);
      console.log(recordList);
      console.log(bufferList);
      buffList = bufferList;
      bufferList.map(function(sound, i){
        var div = document.createElement('div');
        div.setAttribute('data-id', i);
        div.setAttribute('class', 'sound');
        div.addEventListener('click', function(e){
          var id = this.getAttribute('data-id');
          playsound(bufferList[id].buffer, soundboard);
        }, true);
        var text = document.createTextNode(sound.title);
        div.appendChild(text);

        app.appendChild(div);
      });
    });
    bufferLoader.load();
  });

  socket.on('sound', function(data){
    playsound(buffList[data].buffer, soundboard);
  });

  function get(url,callback) {
		var r = new XMLHttpRequest();
		r.responseType = 'text/json';

		r.onreadystatechange = function(e) {
			if (this.readyState == 4) { //Done
				if (this.status == 200) { //Okay we got it
					callback(this.response);
				} else if ( this.status == 404) { //We couldn't find it
					callback("We couldn't find the page, make sure the page exists or you spelt it correctly");
				}
			}
		}

		r.open("GET",url, true);
		r.send(null);

	};

  function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.recordList = [];
    this.loadCount = 0;
  }

  BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", 'http://' + window.location.host + '/sounds/' + url.file, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url.file);
            return;
          }
          // loader.bufferList.push({
          //   id: index,
          //   title: url.title,
          //   buffer: buffer
          // });
          // loader.recordList.push({
          //   id: index,
          //   title: url.title
          // });
          loader.bufferList[index] = {
            id: index,
            title: url.title,
            buffer: buffer
          };
          loader.recordList[index] = {
            id: index,
            title: url.title
          }
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList, loader.recordList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }

    request.send();
  }

  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
  }

  function playsound(buffer, ctx) {
    var sound = ctx.createBufferSource();
    sound.buffer = buffer;
    sound.connect(ctx.destination);
    sound.start(0);
  }
})();
