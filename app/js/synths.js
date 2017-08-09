// This is where we construct our variouse ToneJS instruments
import Tone from 'tone'

export const select = {
  limiter: new Tone.Limiter(-14),

  // create instruments
  duosynth() {
    return new Tone.DuoSynth().toMaster()
  },

  fmsynth() {
    return new Tone.FMSynth().toMaster()
  },

  amsynth() {
    return new Tone.AMSynth().toMaster()
  },

  membsynth() {
    return new Tone.MembraneSynth().toMaster()
  },

  monosynth() {
    return new Tone.MonoSynth().toMaster()
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
