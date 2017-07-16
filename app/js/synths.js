const Tone = require('tone')
const limiter = new Tone.Limiter(-14)

// create instruments
function duosynth() {
  return new Tone.DuoSynth().toMaster()
}

function fmsynth() {
  return new Tone.FMSynth().connect(limiter).toMaster()
}

function amsynth() {
  return new Tone.AMSynth().connect(limiter).toMaster()
}

function membsynth() {
  return new Tone.MembraneSynth().connect(limiter).toMaster()
}

function monosynth() {
  return new Tone.MonoSynth().connect(limiter).toMaster()
}

function someFunc() {}

function square() {
  let sq = new Tone.Synth({
    oscillator: {
      type: 'sawtooth'
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.2,
      release: 0.2
    }
  })
    .connect(limiter)
    .toMaster()
  return sq
}

// export
module.exports = {
  duosynth: duosynth,
  fmsynth: fmsynth,
  amsynth: amsynth,
  membsynth: membsynth,
  monosynth: monosynth,
  square: square
}
