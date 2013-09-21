// requires
var augment  = require("augment"),
    bean     = require("bean"),
    domready = require("domready"),
    Events   = require("event"),
    extend   = require("extend"),
    humane   = require("humane.js"),
    qwery    = require("qwery"),
    Settings = require("settings-store"),
    Spinner  = require("spin.js"),
    truncate = require("truncate"),
    Draggy   = require("draggy"),
    throttle = require("throttle")

// these load into the window
require("turbolinks")
require("remy-polyfills/classList")

// basic initializations
var q = qwery,
    qid = function() { return document.getElementById(arguments[0]) }

bean.setSelectorEngine(qwery)

var settings = new Settings()

var NullNotification = Object.augment(function() {

  this.constructor = function() {}
  this.show = function() {}
  this.cancel = function() {}

})

var Logger = {
  incoming: function(message, callback) {
    console.log('incoming', message.data)
    callback(message)
  },

  outgoing: function(message, callback) {
    console.log('outgoing', message.data)
    callback(message)
  }
};

var App = Object.augment(function() {

  this.constructor = function() {
    this.registerEvents()
    this.registerBindings()
    this.registerSocketListener()
    this.createSpinner()
    this.currentNotification = new NullNotification()
  }

  this.registerEvents = function() {
    var app = this

    app.on("init", function() {
      app.currentSong = window.currentSong
      app.requestCurrentSong()
      app.requestCurrentState()
    })

    app.on("song:change", function(song) {
      app.updateCurrentSong(song)
    })

    app.on("song:clear", function() {
      app.updateCurrentSong({
        title: "Not playing.",
        artist: "Please select a song and hit play.",
      })
    })

    // turbolinks events
    bean.on(document, "page:before-change", function() {
      app.startSpinner()
    })

    bean.on(document, "page:change", function() {
      console.log("%c Page changed to " + window.location.pathname, "font-weight: bold;")
      app.registerPageEvents()
    })

    bean.on(document, "page:load", function() {
      app.stopSpinner()
      app.updateNav()
    })
  }

  this.registerBindings = function() {

    var app = this

    bean.on(document, "click", "[data-command]", function(e) {

      var target = e.currentTarget,
          command = {name: target.dataset['command']}

      if (target.dataset['song']) {
        command['song'] = target.dataset['song']
      }

      app.publish({command: command})

    })

    bean.on(document, "click", "[data-command]", function(e) {

      var button = e.target

      app.publish({command: {
        name: button.dataset.command
      }})

      e.preventDefault()
    })
  }

  this.registerPageEvents = function() {

    var path = window.location.pathname
        app = this

    if (path == "/settings") {

      var maxValue = 200
      var draggy = new Draggy('volume-handle', {
        bindTo: 'volume-slider',
        restrictY: true,
        onChange: throttle(function(value) {
          app.publish({command: {
            name: "volume",
            value: (value / maxValue) * 100
          }})
        }, 500, {leading: false})
      })

      draggy.moveTo(100, 0)

      bean.on(qid("settings-form"), "change", "input", function(e) {

        var el = e.target

        if (el instanceof HTMLInputElement && el.type == "checkbox") {

          var command = {
            name: el.name,
            value: el.checked
          }

          app.publish({command: command})

        }

      })

      bean.on(qid("settings-desktop-notifications"), "click", function(e) {
        if (e.target.checked) {
          window.webkitNotifications.requestPermission()
        }
      })

      bean.on(qid("settings-form"), "submit", function() {

        var desktopNotifications = qid("settings-desktop-notifications").checked
        settings.set("desktopNotifications", desktopNotifications)
      })
    }
  };

  this.createSpinner = function() {
    var opts = {
      lines: 13, // The number of lines to draw
      length: 4, // The length of each line
      width: 2, // The line thickness
      radius: 5, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#FFF', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    }
    this.spinner = new Spinner(opts)
  }

  this.notify = function(msg) {
    humane.log(msg)
  }

  this.updateCurrentSong = function(info) {
    this.currentSong = info
    if (info.image) {
      this.image = new Image()
      this.image.src = info.image
    }

    try {
      qid("current-song-title").innerHTML = info.title
      qid("current-song-artist").innerHTML = info.artist
      qid("current-song-image").src = info.image || "/img/default.png"
    } catch(err) {}

    this.showSongNotification()

    document.title = "\u25B6 " + info.title  + " - " + info.artist + " | Beats"
  }

  this.showSongNotification = function() {
    if (settings.disabled("desktop_notifications") ||
        window.webkitNotifications.checkPermission() != 0) {
      return
    }

    var notification = window.webkitNotifications.createNotification(
      this.currentSong.image || window.location.origin + "/img/default.png",
      this.currentSong.title,
      this.currentSong.artist + (this.currentSong.album ? "\n" + truncate(this.currentSong.album, 30, "...") : "")
    )

    this.currentNotification.cancel()
    this.currentNotification = notification

    notification.show()
  }

  this.updateCurrentSongTime = function(time) {
    if (!this.currentSong) {
      this.requestCurrentSong()
    }

    bar = q(".progress-bar", "#current-song-progress")[0]

    if (bar) {

      var percentage = (time / this.currentSong.time) * 100
      bar.style.width = percentage + "%"
    }
  }

  this.updateState = function(state) {

    var button = qid("current-song-state")

    if (!button) return

    var states = {
      play: "&#9654; Currently playing",
      pause: "&#10074;&#10074; Paused",
      stop: "&#9632; Stopped"
    }
    button.innerHTML = states[state]

    var commands = {
      play: "pause",
      pause: "play",
      stop: "play"
    }
    button.dataset.command = commands[state]

    if (state == "play") {

      button.removeAttribute("disabled")
      button.classList.remove("btn-default")
      button.classList.add("btn-primary")

    } else {

      button.removeAttribute("disabled")
      button.classList.remove("btn-primary")
      button.classList.add("btn-default")
    }
  }

  this.startSpinner = function() {

    this.spinner.spin(qid("spinner"))
  }

  this.stopSpinner = function() {

    this.spinner.stop()
  }

  this.updateNav = function() {

    var button = q("li.active", "#nav")[0]

    if (button) {
      button.classList.remove("active")
    }

    button = q('a[href^=' + window.location.pathname + ']', "#nav")[0]
    if (button) {
      button.parentNode.classList.add("active")
    }
  }

  this.notifications = {
    "play": "Playing",
    "add": "Added"
  }

  this.registerSocketListener = function() {

    this.faye = new Faye.Client('http://localhost:9292/faye')
    // activate logger to debug websocket
    this.faye.addExtension(Logger);

    var subscription = this.faye.subscribe('/events', function(message) {

      if (message.song) {
        this.updateCurrentSong(message.song)

      } else if (message.time) {
        this.updateCurrentSongTime(message.time)

      } else if (message.state) {
        this.updateState(message.state)

      } else if (message.playlistlength) {
        q("[data-bind=playlistlength]").forEach(function(el) {
          el.innerHTML = message.playlistlength
        })
      }
    }.bind(this))
  }

  this.publish = function(data) {

    this.faye.publish("/events", data)
  }

  this.requestCurrentSong = function() {

    this.publish({request: "current_song"})
  }

  this.requestCurrentState = function() {

    this.publish({request: "current_state"})
  }

})

extend(App.prototype, Events.prototype)

window.app = new App()

// app entry point
domready(function() {

  app.trigger("init")

})
