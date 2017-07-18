const inst = require('./synths')
console.log(inst.select.duosynth())

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
        return inst.select.square()
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
