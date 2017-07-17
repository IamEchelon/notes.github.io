const Inst = require('./synths')
const inst = new Inst()

document.addEventListener('DOMContentLoaded', () => {
  // Set and initialize elm constants
  const node = document.getElementById('note-box')
  const elmApp = Elm.Main.embed(node)
  const context = new AudioContext()
  let synth

  // Selects & creates a new instance of tone synthesizer
  function chooseSynth(elmSynth) {
    switch (elmSynth) {
      case 'duosynth':
        return inst.duosynth()
      case 'fmsynth':
        return inst.fmsynth()
      case 'amsynth':
        return inst.amsynth()
      case 'membsynth':
        return inst.membsynth()
      case 'monosynth':
        return inst.monosynth()
      case 'square':
        return inst.square()
      case 'Please Select a Sound-':
        return 'None'
      default:
        console.log('Something has gone horribly awry!')
    }
  }

  function nav(browser) {
    return navigator.userAgent.match(browser)
  }

  // Receive info from Elm
  if (nav(/Android/i) || nav(/iPhone/i) || nav(/iPad/i)) {
    elmApp.ports.initMobile.subscribe(setMobileContext)
  } else {
    elmApp.ports.synthToJS.subscribe(synthSelection)
  }

  // elm callbacks
  function setMobileContext(clear) {
    StartAudioContext(Tone.context, '#playButton')
    elmApp.ports.synthToJS.subscribe(synthSelection)
  }

  function synthSelection(elmSynth) {
    synth = chooseSynth(elmSynth)
    elmApp.ports.noteToJS.subscribe(triggerNote)
  }

  function triggerNote(elmNote) {
    elmNote === '' ? synth.triggerRelease() : synth.triggerAttack(elmNote)
  }

  console.log('Initialized app')
})
