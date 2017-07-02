document.addEventListener('DOMContentLoaded', () => {
  // do your setup here


    // Set and initialize elm constants

    const node = document.getElementById('note-box');

    const elmApp = Elm.Main.embed(node);

    var synth;

    var chooseSynth;

    var context = new AudioContext();



    // Selects & creates a new instance of tone synthesizer

    chooseSynth = (elmValue) => {
        switch (elmValue) {
            case "duosynth":
                var limiter = new Tone.Limiter(-14);
                return new Tone.DuoSynth().connect(limiter).toMaster();

            case "fmsynth":
                return new Tone.FMSynth().toMaster();

            case "membsynth":
                return new Tone.MembraneSynth().toMaster();

            case "monosynth":
                return new Tone.MonoSynth().toMaster();

            case "plucksynth":
                return new Tone.PluckSynth().toMaster();

            case "amsynth":
                return new Tone.AMSynth().toMaster();

            case "Please Select a Sound-":
                return "None"

            default:
                console.log("Something has gone horribly awry!");
        }

    };




    // Receive info from Elm
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)) {
        
        elmApp.ports.initMobile.subscribe((val) => {
            
            StartAudioContext(Tone.context, '#playButton');

            
            elmApp.ports.synthToJS.subscribe((elmValue) => {

                synth = chooseSynth(elmValue);

                var limiter = new Tone.Limiter(-6);

                
                elmApp.ports.noteToJS.subscribe((elmNote) => {
                    
                    if (elmNote === "") {
                        synth.triggerRelease();
                    } else {
                        synth.triggerAttack(elmNote);
                    }
            
            });

            });
        });

    }else {

        elmApp.ports.synthToJS.subscribe((elmValue) => {

            synth = chooseSynth(elmValue);

            var limiter = new Tone.Limiter(-6);

            
            elmApp.ports.noteToJS.subscribe((elmNote) => {

                if (elmNote === "") {
                    synth.triggerRelease();
                } else {
                    synth.triggerAttack(elmNote);
                }
            });

        });
    }

  console.log('Initialized app');
});

