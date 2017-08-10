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

;require.register("js/browser.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var browser = exports.browser = {
  navSelect: function navSelect(browser) {
    return navigator.userAgent.match(browser);
  },
  android: function android() {
    return this.navSelect(/Android/i);
  },
  iphone: function iphone() {
    return this.navSelect(/iPhone/i);
  },
  ipad: function ipad() {
    return this.navSelect(/iPad/i);
  }
};

});

require.register("js/index.js", function(exports, require, module) {
'use strict';

var _synths = require('./synths');

var _browser = require('./browser');

document.addEventListener('DOMContentLoaded', function () {
  // Set and initialize elm constants
  var node = document.getElementById('note-box');
  var elmApp = Elm.Main.embed(node);
  var context = new AudioContext();
  var android = _browser.browser.android();
  var iphone = _browser.browser.iphone();
  var ipad = _browser.browser.ipad();
  var synth = (0, _synths.chooseSynth)('duosynth');

  // elm callbacks
  var triggerNote = function triggerNote(elmNote) {
    return synth.triggerAttack(elmNote);
  };

  var stopNote = function stopNote(noop) {
    return synth.triggerRelease();
  };

  var synthSelection = function synthSelection(elmSynth) {
    return synth = (0, _synths.chooseSynth)(elmSynth);
  };

  var setMobileContext = function setMobileContext(noop) {
    return StartAudioContext(Tone.context, '#playButton');
  };

  // elm subscriptions
  if (android || iphone || ipad) {
    elmApp.ports.initMobile.subscribe(setMobileContext);
  }

  elmApp.ports.synthToJS.subscribe(synthSelection);
  elmApp.ports.noteToJS.subscribe(triggerNote);
  elmApp.ports.stopNote.subscribe(stopNote);

  console.log('Initialized app');
});

});

require.register("js/synths.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseSynth = undefined;

var _tone = require('tone');

var _tone2 = _interopRequireDefault(_tone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var select = {
  limiter: new _tone2.default.Limiter(-14),

  // create instruments
  duosynth: function duosynth() {
    return new _tone2.default.DuoSynth().toMaster();
  },
  fmsynth: function fmsynth() {
    return new _tone2.default.FMSynth().toMaster();
  },
  amsynth: function amsynth() {
    return new _tone2.default.AMSynth().toMaster();
  },
  membsynth: function membsynth() {
    return new _tone2.default.MembraneSynth().toMaster();
  },
  monosynth: function monosynth() {
    return new _tone2.default.MonoSynth().toMaster();
  },
  square: function square() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'sawtooth';
    var attack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.01;
    var decay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.2;
    var sustain = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.2;
    var release = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.2;

    var sq = new _tone2.default.Synth({
      oscillator: {
        type: type
      },
      envelope: {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release
      }
    }).connect(this.limiter).toMaster();
    return sq;
  }
}; // This is where we construct our variouse ToneJS instruments
var chooseSynth = exports.chooseSynth = function chooseSynth(elmSynth) {
  switch (elmSynth) {
    case 'duosynth':
      return select.duosynth();
    case 'fmsynth':
      return select.fmsynth();
    case 'amsynth':
      return select.amsynth();
    case 'membsynth':
      return select.membsynth();
    case 'monosynth':
      return select.monosynth();
    case 'square':
      return select.square('square');
    case 'Please Select a Sound-':
      return 'None';
    default:
      console.log('Something has gone horribly awry!');
  }
};

});

require.alias("buffer/index.js", "buffer");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map