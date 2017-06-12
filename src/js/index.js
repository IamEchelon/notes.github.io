var getSynth = (elmValue) => {

    if (elmValue === "duosynth") {
        return new Tone.DuoSynth().toMaster();

    } else if (elmValue === "fmsynth") {
        return new Tone.FMSynth().toMaster();

    } else if (elmValue === "membsynth") {
        return new Tone.MembraneSynth().toMaster();

    } else if (elmValue === "monosynth") {
        return new Tone.MonoSynth().toMaster();

    } else if (elmValue === "plucksynth") {
        return new Tone.PluckSynth().toMaster();

    }
    else if (elmValue === "amsynth") {
        return new Tone.AMSynth().toMaster();
    }
};

// var synth = getSynth('monosynth');

// Set and initialize elm constants
var node = document.getElementById('note-box');

const elmApp = Elm.Main.embed(node);



// elmApp.ports.selectSynth.subscribe((chosenSynth) => {

//     var synth1 = getSynth(chosenSynth);
//     console.log(synth1)

// });



// Receive port info from Elm
elmApp.ports.signal.subscribe((tone_val) => {

    var synth = getSynth(tone_val.jssynth);

    console.log(tone_val)
    if (tone_val.jsnote) {
        synth.triggerAttack(tone_val.jsnote);
        console.log(tone_val.jsnote)
    } else {
        synth.triggerRelease();
    }

});