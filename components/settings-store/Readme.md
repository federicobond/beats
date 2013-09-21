
# settings-store

  Store client-side settings with ease. Uses `localStorage` if possible.
  Falls back to cookies if not.

## Installation

  Install with [component(1)](http://component.io):

    $ component install federicobond/settings-store

## API

Initialize a new settings object:

    var settings = new Settings()

You can pass an additional `namespace` argument to the constructor to handle
different settings objects. The default namespace is `settings`.

    settings.set("foo", "bar")

    settings.get("foo") // "bar"

    settings.enable("baz")

    settings.disable("baz")

    settings.enabled("baz") // false

    settings.enabled("foo") // true


## License

  UNLICENSE
