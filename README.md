WebSocket Audio
===============

Play (live) audio using HTML5 by streaming from a WebSocket connection.

This is an experimental project that has only been tested in Google Chrome.

### Usage

You will need a WebSocket audio stream to play from - example project for how to do this [here](https://github.com/SamuelFisher/WebSocketAudioServer).

1. Include `dist/wsaudio.js` and `dist/worker.js` in your app
2. Reference `dist/wsaudio.js` in your page
3. Create a new `WsAudio` object

```html
<audio id="audio" autoplay="autoplay" controls="controls"></audio>

<script type="text/javascript" src="dist/wsaudio.js"></script>
<script type="text/javascript">
var wsAudio = new WsAudio(document.getElementById('audio'), 'ws://localhost:5001/stream', 'dist/worker.js');
</script>
```

See [demo.html](blob/master/demo.html) for an example.
