import '../css/main.sass'
import Elm from '../elm/Main.elm'
import { chooseSynth } from './synths'
import { browser } from './browser'

// Set and initialize elm constants
const node = document.getElementById('note-box')
const elmApp = Elm.Main.embed(node)
const context = new AudioContext()
const android = browser.android()
const iphone = browser.iphone()
const ipad = browser.ipad()
let synth = chooseSynth('duosynth')

// elm callbacks
const triggerNote = elmNote => synth.triggerAttack(elmNote)

const stopNote = noop => synth.triggerRelease()

const synthSelection = elmSynth => (synth = chooseSynth(elmSynth))

const setMobileContext = noop => StartAudioContext(Tone.context, '#playButton')

// elm subscriptions
if (android || iphone || ipad) {
  elmApp.ports.initMobile.subscribe(setMobileContext)
}

elmApp.ports.synthToJS.subscribe(synthSelection)
elmApp.ports.noteToJS.subscribe(triggerNote)
elmApp.ports.stopNote.subscribe(stopNote)

console.log('Initialized app')

// document.querySelectorAll('.htmlNote').forEach(note => {
//   note.addEventListener('mousedown', event => {
//     synth.triggerAttack(event.currentTarget.id)
//   })

//   note.addEventListener('mouseup', function(event) {
//     synth.triggerRelease()
//   })
// })
