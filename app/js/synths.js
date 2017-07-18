// This is where we construct our variouse ToneJS instruments
const Tone = require('tone')

module.exports.select = {
  limiter: new Tone.Limiter(-14),

  // create instruments
  duosynth: function() {
    return new Tone.DuoSynth().connect(this.limiter).toMaster()
  },

  fmsynth: function() {
    return new Tone.FMSynth().connect(this.limiter).toMaster()
  },

  amsynth: function() {
    return new Tone.AMSynth().connect(this.limiter).toMaster()
  },

  membsynth: function() {
    return new Tone.MembraneSynth().connect(this.limiter).toMaster()
  },

  monosynth: function() {
    return new Tone.MonoSynth().connect(this.limiter).toMaster()
  },

  square: function(
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
