function Instr() {
  const Tone = require('tone')
  const limiter = new Tone.Limiter(-14)

  // create instruments
  this.duosynth = function() {
    return new Tone.DuoSynth().connect(limiter).toMaster()
  }

  this.fmsynth = function() {
    return new Tone.FMSynth().connect(limiter).toMaster()
  }

  this.amsynth = function() {
    return new Tone.AMSynth().connect(limiter).toMaster()
  }

  this.membsynth = function() {
    return new Tone.MembraneSynth().connect(limiter).toMaster()
  }

  this.monosynth = function() {
    return new Tone.MonoSynth().connect(limiter).toMaster()
  }

  this.square = function(
    attack = 0.01,
    decay = 0.2,
    sustain = 0.2,
    release = 0.2
  ) {
    let sq = new Tone.Synth({
      oscillator: {
        type: 'sawtooth'
      },
      envelope: {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release
      }
    })
      .connect(limiter)
      .toMaster()
    return sq
  }
}

// export
module.exports = Instr
