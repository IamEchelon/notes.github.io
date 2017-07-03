module.exports = {
  config: {
    paths: {
      watched: ["app"]
    },

    files: {
      javascripts: {
        joinTo: {
          'js/vendor.js': /^node_modules/,
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
      browserSync: {
          port: 3333,
          logLevel: "debug"
      },
      
      elmBrunch: {
        mainModules: ["app/elm/Main.elm"],
        outputFolder: "public/js/",
        parameters: ['--warn']
      },
      
      sass: {
        mode: "native",
        percision: 8,
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
    }
  }
};