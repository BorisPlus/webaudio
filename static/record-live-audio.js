var recordButton, stopButton, recorder;
var chunks = [];

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start(1000);
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
  console.log("recorder stopped");
  console.log("data available after MediaRecorder.stop() called.");

//  var audio = document.createElement('audio');
  var audio = document.getElementById('audio');
  audio.controls = true;
  var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
  var audioURL = window.URL.createObjectURL(blob);
  audio.src = audioURL;
  audio.play();

}

function onRecordingReady(e) {
//  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  console.log(e.data)
  chunks.push(e.data);
//  audio.src = URL.createObjectURL(e.data);
//  audio.play();
}
