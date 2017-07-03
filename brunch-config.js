module.exports = {
  config: {
    paths: {
      watched: ["app"]
    },

    files: {
      javascripts: {
        joinTo: {
          'js/vendor.js': /^(?!app)/,
          'js/app.js': /^app/
        }
      },
      
      stylesheets: {
        joinTo: "css/app.css"
      }
    },
    npm: {

    },

    plugins: {

      elmBrunch: {
        mainModules: ["app/elm/Main.elm"],
        outputFolder: "public/js/",
        parameters: ['--warn']
      },
      
      sass: {
        mode: "native",
        options: {
          includePaths: [
            'node_modules/bulma'
          ]
        }
      },
      
      babel: {
        presets: ['es2015'],
        ignore: [
          // /^node_modules/,
          /^elm/
        ]
      }

      // browserSync: {
      //     port: 3333,
      //     logLevel: "debug",
      //     open: "local",
      //     notify: false
      // },

    }
  }
};