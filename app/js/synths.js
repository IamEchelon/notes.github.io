// This is where we construct our variouse ToneJS instruments
const Tone = require('tone')

module.exports.select = {
  limiter: new Tone.Limiter(-14),

  // create instruments
  duosynth() {
    return new Tone.DuoSynth().connect(this.limiter).toMaster()
  },

  fmsynth() {
    return new Tone.FMSynth().connect(this.limiter).toMaster()
  },

  amsynth() {
    return new Tone.AMSynth().connect(this.limiter).toMaster()
  },

  membsynth() {
    return new Tone.MembraneSynth().connect(this.limiter).toMaster()
  },

  monosynth() {
    return new Tone.MonoSynth().connect(this.limiter).toMaster()
  },

  square(
    type = 'sawtooth',
    attack = 0.01,
    decay = 0.2,
    sustain = 0.2,
    release = 0.2
  ) {
    let sq = new Tone.Synth({
      oscillator: {
        type: type
      },
      envelope: {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release
      }
    })
      .connect(this.limiter)
      .toMaster()
    return sq
  }
}
