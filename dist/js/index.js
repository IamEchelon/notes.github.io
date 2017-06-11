"use strict";

var synth = new Tone.AMSynth().toMaster();

var elmApp = Elm.Main.fullscreen();

elmApp.ports.signal.subscribe(function (tone_val) {
    if (tone_val) {
        synth.triggerAttack(tone_val);
        console.log(tone_val);
    } else {
        synth.triggerRelease();
    }
});
//# sourceMappingURL=index.js.map
