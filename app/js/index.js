document.addEventListener('DOMContentLoaded', () => {
  // Set and initialize elm constants
  const node = document.getElementById('note-box');
  const elmApp = Elm.Main.embed(node);
  var synth;
  var chooseSynth;
  var context = new AudioContext();

  // Set up initial instruments
  var limiter = new Tone.Limiter(-14);
  const duosynth = new Tone.DuoSynth().connect(limiter).toMaster();
  const fmsynth = new Tone.FMSynth().connect(limiter).toMaster();
  const square = new Tone.Synth({
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
    .toMaster();

  // Selects & creates a new instance of tone synthesizer
  chooseSynth = elmSynth => {
    switch (elmSynth) {
      case 'duosynth':
        return duosynth;
      case 'fmsynth':
        return fmsynth;
      case 'membsynth':
        return new Tone.MembraneSynth().toMaster();
      case 'monosynth':
        return new Tone.MonoSynth().toMaster();
      case 'square':
        return square;
      case 'amsynth':
        return new Tone.AMSynth().toMaster();
      case 'Please Select a Sound-':
        return 'None';
      default:
        console.log('Something has gone horribly awry!');
    }
  };

  function nav(browser) {
    return navigator.userAgent.match(browser);
  }

  // Receive info from Elm
  if (nav(/Android/i) || nav(/webOS/i) || nav(/iPhone/i) || nav(/iPad/i)) {
    elmApp.ports.initMobile.subscribe(setMobileContext);
  } else {
    elmApp.ports.synthToJS.subscribe(synthSelection);
  }

  // elm callbacks
  function setMobileContext(val) {
    StartAudioContext(Tone.context, '#playButton');
    elmApp.ports.synthToJS.subscribe(synthSelection);
  }

  function synthSelection(elmSynth) {
    synth = chooseSynth(elmSynth);
    elmApp.ports.noteToJS.subscribe(triggerNote);
  }

  function triggerNote(elmNote) {
    elmNote === '' ? synth.triggerRelease() : synth.triggerAttack(elmNote);
  }

  console.log('Initialized app');
});
