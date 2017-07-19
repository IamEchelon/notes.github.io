const inst = require('./synths')
const browser = require('./browser')

document.addEventListener('DOMContentLoaded', () => {
  // Set and initialize elm constants
  const node = document.getElementById('note-box')
  const elmApp = Elm.Main.embed(node)
  const context = new AudioContext()
  let synth
  const android = browser.select.android()
  const iphone = browser.select.iphone()
  const ipad = browser.select.ipad()

  // Selects & creates a new instance of tone synthesizer
  function chooseSynth(elmSynth) {
    switch (elmSynth) {
      case 'duosynth':
        return inst.select.duosynth()
      case 'fmsynth':
        return inst.select.fmsynth()
      case 'amsynth':
        return inst.select.amsynth()
      case 'membsynth':
        return inst.select.membsynth()
      case 'monosynth':
        return inst.select.monosynth()
      case 'square':
        return inst.select.square('square')
      case 'Please Select a Sound-':
        return 'None'
      default:
        console.log('Something has gone horribly awry!')
    }
  }

  // Receive info from Elm
  if (android || iphone || ipad) {
    elmApp.ports.initMobile.subscribe(setMobileContext)
  } else {
    elmApp.ports.synthToJS.subscribe(synthSelection)
  }

  // elm callbacks
  function triggerNote(elmNote) {
    elmNote === '' ? synth.triggerRelease() : synth.triggerAttack(elmNote)
  }

  function synthSelection(elmSynth) {
    synth = chooseSynth(elmSynth)
    elmApp.ports.noteToJS.subscribe(triggerNote)
  }

  function setMobileContext(noop) {
    StartAudioContext(Tone.context, '#playButton')
    elmApp.ports.synthToJS.subscribe(synthSelection)
  }

  console.log('Initialized app')
})
