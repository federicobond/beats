function localStorageSupported() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function Settings(namespace) {
  this.namespace = namespace || "settings";
  this.init();
}

if (localStorageSupported()) {
  Settings.prototype.init = function(key) {
    if (!localStorage[this.namespace]) {
      localStorage[this.namespace] = this._encode({});
    }
  }

  Settings.prototype.get = function(key) {
    return this._decode(localStorage[this.namespace])[key];
  }

  Settings.prototype.set = function(key, value) {
    var settings = this._decode(localStorage[this.namespace]);
    settings[key] = value;
    localStorage[this.namespace] = this._encode(settings);
  }
} else {
  Settings.prototype.init = function(key) {
    var settings = cookie(this.namespace);
    if (!settings) {
      cookie(this.namespace, this._encode({}))
    }
  }

  Settings.prototype.get = function(key) {
    return this._decode(cookie(this.namespace))[key]
  }

  Settings.prototype.set = function(key, value) {
    var settings = this._decode(cookie(this.namespace))
    settings[key] = value
    cookie(this.namespace, this._encode(settings))
  }
}

Settings.prototype.enable = function(key) {
  this.set(key, true);
}

Settings.prototype.disable = function(key) {
  this.set(key, false);
}

Settings.prototype.enabled = function(key) {
  return !!this.get(key);
}

Settings.prototype.disabled = function(key) {
  return !this.get(key);
}

Settings.prototype._encode = function(obj) {
  return encodeURIComponent(JSON.stringify(obj));
}

Settings.prototype._decode = function(str) {
  return JSON.parse(decodeURIComponent(str));
}

module.exports = Settings
