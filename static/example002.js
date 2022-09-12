const RECORD_BTN = document.querySelector('#RECORD')
const DOWNLOAD_BTN = document.querySelector('#DOWNLOAD')
const AUDIO_BTN = document.querySelector('audio')

let CHUNKS = []

DOWNLOAD_BTN.download = "AUDIO.mp3"

let recorder
let socket
const RECORD = () => {
  const toggleRecording = async () => {
    let socket = new WebSocket('ws://'+ window.location.host + '/ws/example002/')
    if (!recorder) {
      // Reset the audio tag
      DOWNLOAD_BTN.removeAttribute('href')
      AUDIO_BTN.removeAttribute('src')
//      AUDIO_BTN.load()
      const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
        audio: true
      })
      recorder = new MediaRecorder(MEDIA_STREAM)
      recorder.start(1000)
      recorder.ondataavailable = event => {
        console.log(event.data)
        CHUNKS.push(event.data)
        socket.send(event.data)
      }
      RECORD_BTN.innerText = 'Stop audio recording'
    } else {
      recorder.stop()
      RECORD_BTN.innerText = 'Start audio recording'
      const AUDIO_BLOB = new Blob(CHUNKS, {type: "audio/mp3"})
      let data = window.URL.createObjectURL(AUDIO_BLOB)
//      AUDIO_BTN.removeAttribute('src')
//      AUDIO_BTN.load()
      AUDIO_BTN.setAttribute('src', data)
      DOWNLOAD_BTN.setAttribute('href', data)
      recorder = null
      socket.close()
    }
  }
  toggleRecording()
}

RECORD_BTN.addEventListener('click', RECORD)
