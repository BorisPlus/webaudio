const RECORD_BTN = document.querySelector('#RECORD')
const SAVE_BTN = document.querySelector('#SAVE')
const DOWNLOAD_BTN = document.querySelector('#DOWNLOAD')
const AUDIO_BTN = document.querySelector('audio')

let CHUNKS = []

DOWNLOAD_BTN.download = "AUDIO.mp3"

let recorder
const RECORD = () => {
  const toggleRecording = async () => {
    if (!recorder) {
      // Reset the audio tag
      SAVE_BTN.disabled = "disabled"
      DOWNLOAD_BTN.disabled = "disabled"
      DOWNLOAD_BTN.removeAttribute('href')
      AUDIO_BTN.removeAttribute('src')
      const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
        audio: true
      })
      recorder = new MediaRecorder(MEDIA_STREAM)
      recorder.ondataavailable = event => {
        // Update the UI
        RECORD_BTN.innerText = 'Start audio recording'
        recorder = null
        // Create the blob and show an audio element
        CHUNKS.push(event.data)
        const AUDIO_BLOB = new Blob(CHUNKS, {type: "audio/mp3"})
        let data = window.URL.createObjectURL(AUDIO_BLOB)
        AUDIO_BTN.setAttribute('src', data)
        SAVE_BTN.disabled = false
        DOWNLOAD_BTN.disabled = false
        DOWNLOAD_BTN.removeAttribute('disabled')
        DOWNLOAD_BTN.setAttribute('href', data)
        console.log(DOWNLOAD_BTN.onclick)
      }
      RECORD_BTN.innerText = 'Stop audio recording'
      recorder.start()
    } else {
      recorder.stop()
    }
  }
  toggleRecording()
}

const SAVE = () => {
  const saving = async () => {
    console.log('AUDIO_BTN.src', AUDIO_BTN.src)
    const file_data = new Blob(CHUNKS, {type: "audio/mp3"});
    //const file_data = window.URL.revokeObjectURL(AUDIO_BTN.src)
    console.log('file_data', file_data)
    const formData = new FormData();
    formData.append('file', file_data, 'recording.mp3');
    fetch('save', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      SAVE_BTN.disabled = true
      DOWNLOAD_BTN.removeAttribute('href')
    })
    .catch(error => {
      SAVE_BTN.disabled = true
    })
  }
  saving()
}

RECORD_BTN.addEventListener('click', RECORD)
SAVE_BTN.addEventListener('click', SAVE)