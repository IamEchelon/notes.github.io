(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("elm/Main.elm", function(exports, require, module) {

});

;require.register("elm/Note.elm", function(exports, require, module) {

});

;require.register("elm/Shapes.elm", function(exports, require, module) {

});

;require.register("js/index.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Set and initialize elm constants
  var node = document.getElementById("note-box");
  var elmApp = Elm.Main.embed(node);
  var synth;
  var chooseSynth;
  var context = new AudioContext();

  // Selects & creates a new instance of tone synthesizer
  chooseSynth = function chooseSynth(elmValue) {
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
        return "None";
      default:
        console.log("Something has gone horribly awry!");
    }
  };

  // Receive info from Elm
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    elmApp.ports.initMobile.subscribe(function (val) {
      StartAudioContext(Tone.context, "#playButton");

      elmApp.ports.synthToJS.subscribe(function (elmValue) {
        synth = chooseSynth(elmValue);
        var limiter = new Tone.Limiter(-6);

        elmApp.ports.noteToJS.subscribe(function (elmNote) {
          if (elmNote === "") {
            synth.triggerRelease();
          } else {
            synth.triggerAttack(elmNote);
          }
        });
      });
    });
  } else {
    elmApp.ports.synthToJS.subscribe(function (elmValue) {
      synth = chooseSynth(elmValue);
      var limiter = new Tone.Limiter(-6);

      elmApp.ports.noteToJS.subscribe(function (elmNote) {
        if (elmNote === "") {
          synth.triggerRelease();
        } else {
          synth.triggerAttack(elmNote);
        }
      });
    });
  }

  console.log("Initialized app");
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map