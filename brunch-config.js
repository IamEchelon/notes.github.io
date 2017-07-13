module.exports = {
  config: {
    paths: {
      watched: ['app']
    },

    files: {
      javascripts: {
        joinTo: {
          'js/vendor.js': /^(?!app)/,
          'js/app.js': /^app/
        }
      },
      stylesheets: {
        joinTo: 'css/app.css'
      }
    },

    plugins: {
      elmBrunch: {
        mainModules: ['app/elm/Main.elm'],
        outputFolder: 'public/js/',
        parameters: ['--warn', '--debug']
      },
      sass: {
        mode: 'native',
        options: {
          includePaths: ['node_modules/bulma']
        }
      },
      babel: {
        presets: ['es2015'],
        ignore: [/^elm/]
      }
      // browserSync: {
      //   port: 3333,
      //   logLevel: "debug",
      //   notify: false
      // }
    }
  }
};
