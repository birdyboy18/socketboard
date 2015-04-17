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
      buffList = bufferList;
      bufferList.map(function(sound, i){
        var outerDiv = document.createElement('div');
        outerDiv.setAttribute('data-id', sound.id);
        outerDiv.setAttribute('class', 'sound-outer');
        outerDiv.addEventListener('click', function(e){
          var id = this.getAttribute('data-id');
          playsound(bufferList[id].buffer, soundboard);
        }, true);
        var innerDiv = document.createElement('div');
        innerDiv.setAttribute('class', 'sound');
        innerDiv.setAttribute('id', sound.id);
        var text = document.createTextNode(sound.title);

        innerDiv.appendChild(text);
        outerDiv.appendChild(innerDiv);
        app.appendChild(outerDiv);
      });
    });
    bufferLoader.load();
  });

  socket.on('sound', function(data){
    playsound(buffList[data].buffer, soundboard);
    var divs = document.getElementsByClassName('sound');
    for (var i = 0, l = divs.length; i < l; i++) {
      divs[i].setAttribute('class', 'sound');
    }
    var selectedDiv = document.getElementById(data);
    selectedDiv.setAttribute('class', 'sound selected');
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
