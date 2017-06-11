var synth = new Tone.AMSynth().toMaster()


const node = document.getElementById('note-box');
const elmApp = Elm.Main.embed(node);

elmApp.ports.signal.subscribe(function (tone_val) {
    if (tone_val) {
        synth.triggerAttack(tone_val);
        console.log(tone_val)
    } else {
        synth.triggerRelease();
    }

});
