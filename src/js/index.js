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



// Set and initialize elm constants
var node = document.getElementById('note-box');

const elmApp = Elm.Main.embed(node);



var synth = getSynth("duosynth");

// Receive port info from Elm
elmApp.ports.toJS.subscribe((tone_val) => {

    // console.log(tone_val);

    if (tone_val.update) {
        var synth1 = getSynth(tone_val.jssynth);
        return synth1;
    }

    console.log(synth1);

    if (tone_val.noteToJS === "") {
        synth.triggerRelease();
    } else {
        synth.triggerAttack(tone_val.noteToJS);

    }

});