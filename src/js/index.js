// Set and initialize elm constants

const node = document.getElementById('note-box');

const elmApp = Elm.Main.embed(node);

var synth;

var chooseSynth;

// Selects & creates a new instance of tone synthesizer

chooseSynth = (elmValue) => 
{   switch (elmValue) 
    {    
        case "duosynth":
            return new Tone.DuoSynth().toMaster();

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

elmApp.ports.synthToJS.subscribe( (elmValue) => 
{   
    synth = chooseSynth(elmValue);

    elmApp.ports.noteToJS.subscribe( (elmNote) =>
    { if (elmNote === "")
    {    synth.triggerRelease();
    } else 
    {    synth.triggerAttack(elmNote);
    }
    });
    
});


