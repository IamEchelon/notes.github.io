// Set and initialize elm constants

const node = document.getElementById('note-box');

const elmApp = Elm.Main.embed(node);

var synth;

var chooseSynth;

// Selects & creates a new instance of tone synthesizer

chooseSynth = (elmValue) => {
    console.log(elmValue);
    switch (elmValue) {
        case "duosynth":
            return new Tone.DuoSynth().toMaster();
            break;
        case "fmsynth":
            return new Tone.FMSynth().toMaster();
            break;
        case "membsynth":
            return new Tone.MembraneSynth().toMaster();
            break;
        case "monosynth":
            return new Tone.MonoSynth().toMaster();
            break;
        case "plucksynth":
            return new Tone.PluckSynth().toMaster();
            break;
        case "amsynth":
            return new Tone.AMSynth().toMaster();
            break;
        default:
            console.log("Something has gone horribly awry!");
    }

};

synth = chooseSynth("duosynth");


// Receive info from Elm

elmApp.ports.noteToJS.subscribe(function (elmNote) {
    if (elmNote === "") {
        synth.triggerRelease();
    } else {
        synth.triggerAttack(elmNote);

    }
});

