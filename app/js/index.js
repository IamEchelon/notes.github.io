import { select } from './synths'
import { browser } from './browser'

document.addEventListener('DOMContentLoaded', () => {
  // Set and initialize elm constants
  const node = document.getElementById('note-box')
  const elmApp = Elm.Main.embed(node)
  const context = new AudioContext()
  let synth
  const android = browser.android()
  const iphone = browser.iphone()
  const ipad = browser.ipad()

  // Selects & creates a new instance of tone synthesizer
  const chooseSynth = elmSynth => {
    switch (elmSynth) {
      case 'duosynth':
        return select.duosynth()
      case 'fmsynth':
        return select.fmsynth()
      case 'amsynth':
        return select.amsynth()
      case 'membsynth':
        return select.membsynth()
      case 'monosynth':
        return select.monosynth()
      case 'square':
        return select.square('square')
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
  const triggerNote = elmNote => synth.triggerAttack(elmNote)

  const stopNote = noop => synth.triggerRelease()

  function synthSelection(elmSynth) {
    synth = chooseSynth(elmSynth)
    elmApp.ports.noteToJS.subscribe(triggerNote)
    elmApp.ports.stopNote.subscribe(stopNote)
  }

  const setMobileContext = noop => {
    StartAudioContext(Tone.context, '#playButton')
    elmApp.ports.synthToJS.subscribe(synthSelection)
  }

  console.log('Initialized app')
})
