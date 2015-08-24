exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.

  # Application build path.  Default is public
  #buildPath: ''

  paths:
    public: "../resources/public"
    
  plugins:
    babel:
      ignore: [/(vendor|bower_components)/]

    jshint:
      pattern: /^app\/.*\.js$/
      options:
        bitwise: true
        curly: true
      globals:
        jQuery: true
      warnOnly: true

    assetsmanager: {
      copyTo: {
        '/themes/' : ['bower_components/semantic/dist/themes/*']
        # For local testing needed
        '/stylesheets/themes/' : ['bower_components/semantic/dist/themes/*']
      }
    }

  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components)/

    stylesheets:
      defaultExtension: 'styl'
      joinTo:
        'stylesheets/app.css': /^(app|vendor|bower_components)/
      order:
        before: ['vendor/styles/normalize.css']
        after: ['vendor/styles/helpers.css']

  minify: no
