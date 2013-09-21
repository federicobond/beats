
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jb55-domready/index.js", function(exports, require, module){
/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loaded = /^loade|c/.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})

});
require.register("ded-qwery/qwery.js", function(exports, require, module){
/*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  * MIT License
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

  var walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      }
    , '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode
      }
    , '~': function (node) {
        return node && node.previousSibling
      }
    , '+': function (node, contestant, p1, p2) {
        if (!node) return false
        return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
      }
    }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  // not quite as fast as inline loops in older browsers so don't use liberally
  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  // called using `this` as element and arguments from regex group results.
  // given => div.hello[title="world"]:foo('bar')
  // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      // select is for attrib equality
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  // given a selector, first check for simple cases then collect all base candidate matches and filter
  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    // collect base candidates to filter
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    // filter elements according to the right-most part of the selector
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    // filter further according to the rest of the selector (the left side)
    each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  // compare element to a selector
  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  // given elements matching the right-most part of a selector, filter out any that don't match the rest
  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    // recursively work backwards through the tokens and up the dom, covering all options
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j;
    o:
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    // easy, fast cases that we can dispatch with simple DOM calls
    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  // where the root is not document and a relationship selector is first we have to
  // do some awkward adjustments to get it to work, even with qSA
  function collectSelector(root, collector) {
    return function (s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
          // make sure the el has an id, rewrite the query, set root to doc and run it
          if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
          s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
          collector(root.parentNode || root, s, true)
          oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
    }()
  , hasByClass = !!doc[byClass]
    // has native qSA support
  , hasQSA = doc.querySelector && doc[qSA]
    // use native qSA
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          // most work is done right here, defer to qSA
          return arrayify(root[qSA](selector))
        }
        // special case where we need the services of `collectSelector()`
        each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
    }
    // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      // configNativeQSA: use fully-internal selector or native qSA where present
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
});

});
require.register("fat-bean/bean.js", function(exports, require, module){
/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  * MIT license
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bean', this, function (name, context) {
  name    = name    || 'bean'
  context = context || this

  var win            = window
    , old            = context[name]
    , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
    , nameRegex      = /\..*/
    , addEvent       = 'addEventListener'
    , removeEvent    = 'removeEventListener'
    , doc            = document || {}
    , root           = doc.documentElement || {}
    , W3C_MODEL      = root[addEvent]
    , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
    , ONE            = {} // singleton for quick matching making add() do one()

    , slice          = Array.prototype.slice
    , str2arr        = function (s, d) { return s.split(d || ' ') }
    , isString       = function (o) { return typeof o == 'string' }
    , isFunction     = function (o) { return typeof o == 'function' }

      // events that we consider to be 'native', anything not in this list will
      // be treated as a custom event
    , standardNativeEvents =
        'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
        'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
        'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
        'keydown keypress keyup '                                        + // keyboard
        'orientationchange '                                             + // mobile
        'focus blur change reset select submit '                         + // form elements
        'load unload beforeunload resize move DOMContentLoaded '         + // window
        'readystatechange message '                                      + // window
        'error abort scroll '                                              // misc
      // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
      // that doesn't actually exist, so make sure we only do these on newer browsers
    , w3cNativeEvents =
        'show '                                                          + // mouse buttons
        'input invalid '                                                 + // form elements
        'touchstart touchmove touchend touchcancel '                     + // touch
        'gesturestart gesturechange gestureend '                         + // gesture
        'textinput'                                                      + // TextEvent
        'readystatechange pageshow pagehide popstate '                   + // window
        'hashchange offline online '                                     + // window
        'afterprint beforeprint '                                        + // printing
        'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
        'loadstart progress suspend emptied stalled loadmetadata '       + // media
        'loadeddata canplay canplaythrough playing waiting seeking '     + // media
        'seeked ended durationchange timeupdate play pause ratechange '  + // media
        'volumechange cuechange '                                        + // media
        'checking noupdate downloading cached updateready obsolete '       // appcache

      // convert to a hash for quick lookups
    , nativeEvents = (function (hash, events, i) {
        for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
        return hash
      }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))

      // custom events are events that we *fake*, they are not provided natively but
      // we can use native events to generate them
    , customEvents = (function () {
        var isAncestor = 'compareDocumentPosition' in root
              ? function (element, container) {
                  return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                }
              : 'contains' in root
                ? function (element, container) {
                    container = container.nodeType === 9 || container === window ? root : container
                    return container !== element && container.contains(element)
                  }
                : function (element, container) {
                    while (element = element.parentNode) if (element === container) return 1
                    return 0
                  }
          , check = function (event) {
              var related = event.relatedTarget
              return !related
                ? related == null
                : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                    && !isAncestor(related, this))
            }

        return {
            mouseenter: { base: 'mouseover', condition: check }
          , mouseleave: { base: 'mouseout', condition: check }
          , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
        }
      }())

      // we provide a consistent Event object across browsers by taking the actual DOM
      // event object and generating a new one from its properties.
    , Event = (function () {
            // a whitelist of properties (for different event types) tells us what to check for and copy
        var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
              'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
              'srcElement target timeStamp type view which propertyName')
          , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
              'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
          , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
              'axis')) // 'axis' is FF specific
          , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
              'keyLocation location'))
          , textProps    = commonProps.concat(str2arr('data'))
          , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
          , messageProps = commonProps.concat(str2arr('data origin source'))
          , stateProps   = commonProps.concat(str2arr('state'))
          , overOutRegex = /over|out/
            // some event types need special handling and some need special properties, do that all here
          , typeFixers   = [
                { // key events
                    reg: /key/i
                  , fix: function (event, newEvent) {
                      newEvent.keyCode = event.keyCode || event.which
                      return keyProps
                    }
                }
              , { // mouse events
                    reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                  , fix: function (event, newEvent, type) {
                      newEvent.rightClick = event.which === 3 || event.button === 2
                      newEvent.pos = { x: 0, y: 0 }
                      if (event.pageX || event.pageY) {
                        newEvent.clientX = event.pageX
                        newEvent.clientY = event.pageY
                      } else if (event.clientX || event.clientY) {
                        newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                        newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                      }
                      if (overOutRegex.test(type)) {
                        newEvent.relatedTarget = event.relatedTarget
                          || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                      }
                      return mouseProps
                    }
                }
              , { // mouse wheel events
                    reg: /mouse.*(wheel|scroll)/i
                  , fix: function () { return mouseWheelProps }
                }
              , { // TextEvent
                    reg: /^text/i
                  , fix: function () { return textProps }
                }
              , { // touch and gesture events
                    reg: /^touch|^gesture/i
                  , fix: function () { return touchProps }
                }
              , { // message events
                    reg: /^message$/i
                  , fix: function () { return messageProps }
                }
              , { // popstate events
                    reg: /^popstate$/i
                  , fix: function () { return stateProps }
                }
              , { // everything else
                    reg: /.*/
                  , fix: function () { return commonProps }
                }
            ]
          , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism

          , Event = function (event, element, isNative) {
              if (!arguments.length) return
              event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
              this.originalEvent = event
              this.isNative       = isNative
              this.isBean         = true

              if (!event) return

              var type   = event.type
                , target = event.target || event.srcElement
                , i, l, p, props, fixer

              this.target = target && target.nodeType === 3 ? target.parentNode : target

              if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                fixer = typeFixerMap[type]
                if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                  for (i = 0, l = typeFixers.length; i < l; i++) {
                    if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                      typeFixerMap[type] = fixer = typeFixers[i].fix
                      break
                    }
                  }
                }

                props = fixer(event, this, type)
                for (i = props.length; i--;) {
                  if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                }
              }
            }

        // preventDefault() and stopPropagation() are a consistent interface to those functions
        // on the DOM, stop() is an alias for both of them together
        Event.prototype.preventDefault = function () {
          if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
          else this.originalEvent.returnValue = false
        }
        Event.prototype.stopPropagation = function () {
          if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
          else this.originalEvent.cancelBubble = true
        }
        Event.prototype.stop = function () {
          this.preventDefault()
          this.stopPropagation()
          this.stopped = true
        }
        // stopImmediatePropagation() has to be handled internally because we manage the event list for
        // each element
        // note that originalElement may be a Bean#Event object in some situations
        Event.prototype.stopImmediatePropagation = function () {
          if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
          this.isImmediatePropagationStopped = function () { return true }
        }
        Event.prototype.isImmediatePropagationStopped = function () {
          return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
        }
        Event.prototype.clone = function (currentTarget) {
          //TODO: this is ripe for optimisation, new events are *expensive*
          // improving this will speed up delegated events
          var ne = new Event(this, this.element, this.isNative)
          ne.currentTarget = currentTarget
          return ne
        }

        return Event
      }())

      // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
    , targetElement = function (element, isNative) {
        return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
      }

      /**
        * Bean maintains an internal registry for event listeners. We don't touch elements, objects
        * or functions to identify them, instead we store everything in the registry.
        * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
        */
    , RegEntry = (function () {
        // each handler is wrapped so we can handle delegation and custom events
        var wrappedHandler = function (element, fn, condition, args) {
            var call = function (event, eargs) {
                  return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                }
              , findTarget = function (event, eventElement) {
                  return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                }
              , handler = condition
                  ? function (event) {
                      var target = findTarget(event, this) // deleated event
                      if (condition.apply(target, arguments)) {
                        if (event) event.currentTarget = target
                        return call(event, arguments)
                      }
                    }
                  : function (event) {
                      if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                      return call(event, arguments)
                    }
            handler.__beanDel = fn.__beanDel
            return handler
          }

        , RegEntry = function (element, type, handler, original, namespaces, args, root) {
            var customType     = customEvents[type]
              , isNative

            if (type == 'unload') {
              // self clean-up
              handler = once(removeListener, element, type, handler, original)
            }

            if (customType) {
              if (customType.condition) {
                handler = wrappedHandler(element, handler, customType.condition, args)
              }
              type = customType.base || type
            }

            this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
            this.customType    = !W3C_MODEL && !isNative && type
            this.element       = element
            this.type          = type
            this.original      = original
            this.namespaces    = namespaces
            this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
            this.target        = targetElement(element, isNative)
            this[eventSupport] = !!this.target[eventSupport]
            this.root          = root
            this.handler       = wrappedHandler(element, handler, null, args)
          }

        // given a list of namespaces, is our entry in any of them?
        RegEntry.prototype.inNamespaces = function (checkNamespaces) {
          var i, j, c = 0
          if (!checkNamespaces) return true
          if (!this.namespaces) return false
          for (i = checkNamespaces.length; i--;) {
            for (j = this.namespaces.length; j--;) {
              if (checkNamespaces[i] == this.namespaces[j]) c++
            }
          }
          return checkNamespaces.length === c
        }

        // match by element, original fn (opt), handler fn (opt)
        RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
          return this.element === checkElement &&
            (!checkOriginal || this.original === checkOriginal) &&
            (!checkHandler || this.handler === checkHandler)
        }

        return RegEntry
      }())

    , registry = (function () {
        // our map stores arrays by event type, just because it's better than storing
        // everything in a single array.
        // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
        // rootListeners so we can look them up fast
        var map = {}

          // generic functional search of our registry for matching listeners,
          // `fn` returns false to break out of the loop
          , forAll = function (element, type, original, handler, root, fn) {
              var pfx = root ? 'r' : '$'
              if (!type || type == '*') {
                // search the whole registry
                for (var t in map) {
                  if (t.charAt(0) == pfx) {
                    forAll(element, t.substr(1), original, handler, root, fn)
                  }
                }
              } else {
                var i = 0, l, list = map[pfx + type], all = element == '*'
                if (!list) return
                for (l = list.length; i < l; i++) {
                  if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                }
              }
            }

          , has = function (element, type, original, root) {
              // we're not using forAll here simply because it's a bit slower and this
              // needs to be fast
              var i, list = map[(root ? 'r' : '$') + type]
              if (list) {
                for (i = list.length; i--;) {
                  if (!list[i].root && list[i].matches(element, original, null)) return true
                }
              }
              return false
            }

          , get = function (element, type, original, root) {
              var entries = []
              forAll(element, type, original, null, root, function (entry) {
                return entries.push(entry)
              })
              return entries
            }

          , put = function (entry) {
              var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                , key = (entry.root ? 'r' : '$') + entry.type
              ;(map[key] || (map[key] = [])).push(entry)
              return has
            }

          , del = function (entry) {
              forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                list.splice(i, 1)
                entry.removed = true
                if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                return false
              })
            }

            // dump all entries, used for onunload
          , entries = function () {
              var t, entries = []
              for (t in map) {
                if (t.charAt(0) == '$') entries = entries.concat(map[t])
              }
              return entries
            }

        return { has: has, get: get, put: put, del: del, entries: entries }
      }())

      // we need a selector engine for delegated events, use querySelectorAll if it exists
      // but for older browsers we need Qwery, Sizzle or similar
    , selectorEngine
    , setSelectorEngine = function (e) {
        if (!arguments.length) {
          selectorEngine = doc.querySelectorAll
            ? function (s, r) {
                return r.querySelectorAll(s)
              }
            : function () {
                throw new Error('Bean: No selector engine installed') // eeek
              }
        } else {
          selectorEngine = e
        }
      }

      // we attach this listener to each DOM event that we need to listen to, only once
      // per event type per DOM element
    , rootListener = function (event, type) {
        if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return

        var listeners = registry.get(this, type || event.type, null, false)
          , l = listeners.length
          , i = 0

        event = new Event(event, this, true)
        if (type) event.type = type

        // iterate through all handlers registered for this type, calling them unless they have
        // been removed by a previous handler or stopImmediatePropagation() has been called
        for (; i < l && !event.isImmediatePropagationStopped(); i++) {
          if (!listeners[i].removed) listeners[i].handler.call(this, event)
        }
      }

      // add and remove listeners to DOM elements
    , listener = W3C_MODEL
        ? function (element, type, add) {
            // new browsers
            element[add ? addEvent : removeEvent](type, rootListener, false)
          }
        : function (element, type, add, custom) {
            // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
            // to simulate event bubbling etc.
            var entry
            if (add) {
              registry.put(entry = new RegEntry(
                  element
                , custom || type
                , function (event) { // handler
                    rootListener.call(element, event, custom)
                  }
                , rootListener
                , null
                , null
                , true // is root
              ))
              if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
              entry.target.attachEvent('on' + entry.eventType, entry.handler)
            } else {
              entry = registry.get(element, custom || type, rootListener, true)[0]
              if (entry) {
                entry.target.detachEvent('on' + entry.eventType, entry.handler)
                registry.del(entry)
              }
            }
          }

    , once = function (rm, element, type, fn, originalFn) {
        // wrap the handler in a handler that does a remove as well
        return function () {
          fn.apply(this, arguments)
          rm(element, type, originalFn)
        }
      }

    , removeListener = function (element, orgType, handler, namespaces) {
        var type     = orgType && orgType.replace(nameRegex, '')
          , handlers = registry.get(element, type, null, false)
          , removed  = {}
          , i, l

        for (i = 0, l = handlers.length; i < l; i++) {
          if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
            // TODO: this is problematic, we have a registry.get() and registry.del() that
            // both do registry searches so we waste cycles doing this. Needs to be rolled into
            // a single registry.forAll(fn) that removes while finding, but the catch is that
            // we'll be splicing the arrays that we're iterating over. Needs extra tests to
            // make sure we don't screw it up. @rvagg
            registry.del(handlers[i])
            if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
              removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
          }
        }
        // check each type/element for removed listeners and remove the rootListener where it's no longer needed
        for (i in removed) {
          if (!registry.has(element, removed[i].t, null, false)) {
            // last listener of this type, remove the rootListener
            listener(element, removed[i].t, false, removed[i].c)
          }
        }
      }

      // set up a delegate helper using the given selector, wrap the handler function
    , delegate = function (selector, fn) {
        //TODO: findTarget (therefore $) is called twice, once for match and once for
        // setting e.currentTarget, fix this so it's only needed once
        var findTarget = function (target, root) {
              var i, array = isString(selector) ? selectorEngine(selector, root) : selector
              for (; target && target !== root; target = target.parentNode) {
                for (i = array.length; i--;) {
                  if (array[i] === target) return target
                }
              }
            }
          , handler = function (e) {
              var match = findTarget(e.target, this)
              if (match) fn.apply(match, arguments)
            }

        // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
        handler.__beanDel = {
            ft       : findTarget // attach it here for customEvents to use too
          , selector : selector
        }
        return handler
      }

    , fireListener = W3C_MODEL ? function (isNative, type, element) {
        // modern browsers, do a proper dispatchEvent()
        var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
        evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
        element.dispatchEvent(evt)
      } : function (isNative, type, element) {
        // old browser use onpropertychange, just increment a custom property to trigger the event
        element = targetElement(element, isNative)
        isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
      }

      /**
        * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
        */

      /**
        * off(element[, eventType(s)[, handler ]])
        */
    , off = function (element, typeSpec, fn) {
        var isTypeStr = isString(typeSpec)
          , k, type, namespaces, i

        if (isTypeStr && typeSpec.indexOf(' ') > 0) {
          // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
          typeSpec = str2arr(typeSpec)
          for (i = typeSpec.length; i--;)
            off(element, typeSpec[i], fn)
          return element
        }

        type = isTypeStr && typeSpec.replace(nameRegex, '')
        if (type && customEvents[type]) type = customEvents[type].base

        if (!typeSpec || isTypeStr) {
          // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
          if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
          removeListener(element, type, fn, namespaces)
        } else if (isFunction(typeSpec)) {
          // off(el, fn)
          removeListener(element, null, typeSpec)
        } else {
          // off(el, { t1: fn1, t2, fn2 })
          for (k in typeSpec) {
            if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
          }
        }

        return element
      }

      /**
        * on(element, eventType(s)[, selector], handler[, args ])
        */
    , on = function(element, events, selector, fn) {
        var originalFn, type, types, i, args, entry, first

        //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
        if (selector === undefined && typeof events == 'object') {
          //TODO: this can't handle delegated events
          for (type in events) {
            if (events.hasOwnProperty(type)) {
              on.call(this, element, type, events[type])
            }
          }
          return
        }

        if (!isFunction(selector)) {
          // delegated event
          originalFn = fn
          args       = slice.call(arguments, 4)
          fn         = delegate(selector, originalFn, selectorEngine)
        } else {
          args       = slice.call(arguments, 3)
          fn         = originalFn = selector
        }

        types = str2arr(events)

        // special case for one(), wrap in a self-removing handler
        if (this === ONE) {
          fn = once(off, element, events, fn, originalFn)
        }

        for (i = types.length; i--;) {
          // add new handler to the registry and check if it's the first for this element/type
          first = registry.put(entry = new RegEntry(
              element
            , types[i].replace(nameRegex, '') // event type
            , fn
            , originalFn
            , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
            , args
            , false // not root
          ))
          if (entry[eventSupport] && first) {
            // first event of this type on this element, add root listener
            listener(element, entry.eventType, true, entry.customType)
          }
        }

        return element
      }

      /**
        * add(element[, selector], eventType(s), handler[, args ])
        *
        * Deprecated: kept (for now) for backward-compatibility
        */
    , add = function (element, events, fn, delfn) {
        return on.apply(
            null
          , !isString(fn)
              ? slice.call(arguments)
              : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
        )
      }

      /**
        * one(element, eventType(s)[, selector], handler[, args ])
        */
    , one = function () {
        return on.apply(ONE, arguments)
      }

      /**
        * fire(element, eventType(s)[, args ])
        *
        * The optional 'args' argument must be an array, if no 'args' argument is provided
        * then we can use the browser's DOM event system, otherwise we trigger handlers manually
        */
    , fire = function (element, type, args) {
        var types = str2arr(type)
          , i, j, l, names, handlers

        for (i = types.length; i--;) {
          type = types[i].replace(nameRegex, '')
          if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
          if (!names && !args && element[eventSupport]) {
            fireListener(nativeEvents[type], type, element)
          } else {
            // non-native event, either because of a namespace, arguments or a non DOM element
            // iterate over all listeners and manually 'fire'
            handlers = registry.get(element, type, null, false)
            args = [false].concat(args)
            for (j = 0, l = handlers.length; j < l; j++) {
              if (handlers[j].inNamespaces(names)) {
                handlers[j].handler.apply(element, args)
              }
            }
          }
        }
        return element
      }

      /**
        * clone(dstElement, srcElement[, eventType ])
        *
        * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
        */
    , clone = function (element, from, type) {
        var handlers = registry.get(from, type, null, false)
          , l = handlers.length
          , i = 0
          , args, beanDel

        for (; i < l; i++) {
          if (handlers[i].original) {
            args = [ element, handlers[i].type ]
            if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
            args.push(handlers[i].original)
            on.apply(null, args)
          }
        }
        return element
      }

    , bean = {
          on                : on
        , add               : add
        , one               : one
        , off               : off
        , remove            : off
        , clone             : clone
        , fire              : fire
        , Event             : Event
        , setSelectorEngine : setSelectorEngine
        , noConflict        : function () {
            context[name] = old
            return this
          }
      }

  // for IE, clean up on unload to avoid leaks
  if (win.attachEvent) {
    var cleanup = function () {
      var i, entries = registry.entries()
      for (i in entries) {
        if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
      }
      win.detachEvent('onunload', cleanup)
      win.CollectGarbage && win.CollectGarbage()
    }
    win.attachEvent('onunload', cleanup)
  }

  // initialize selector engine to internal default (qSA or throw Error)
  setSelectorEngine()

  return bean
});

});
require.register("itsjoesullivan-event/index.js", function(exports, require, module){
module.exports = function() {};

/** 
 * Add a listener by event name
 * @param {String} name
 * @param {Function} fn
 * @return {Event} instance
 * @api public
 */
module.exports.prototype.on = function(name,fn) {

	//Lazy instanciation of events object
	var events = this.events = this.events || {};

	//Lazy instanciation of specific event
  events[name] = events[name] || [];

  //Give it the function
  events[name].push(fn);

  return this;

};


/** 
 * Trigger an event by name, passing arguments
 * 
 * @param {String} name
 * @return {Event} instance
 * @api public
 */
module.exports.prototype.trigger = function(name, arg1, arg2 /** ... */) {

	//Only if events + this event exist...
  if(!this.events || !this.events[name]) return this;

  //Grab the listeners
  var listeners = this.events[name],
    //All arguments after the name should be passed to the function
  	args = Array.prototype.slice.call(arguments,1);

  //So we can efficiently apply below
  function triggerFunction(fn) {
  	fn.apply(this,args);
  };

  if('forEach' in listeners) {
  	listeners.forEach(triggerFunction.bind(this));
  } else {
  	for(var i in listeners) {
  	  if(listeners.hasOwnProperty(i)) triggerFunction(fn);
  	}
  }

  return this;

};

});
require.register("component-inherit/index.js", function(exports, require, module){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};

});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

});
require.register("component-classes/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el) throw new Error('A DOM element reference is required');
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name){
  // classList
  if (this.list) {
    this.list.toggle(name);
    return this;
  }

  // fallback
  if (this.has(name)) {
    this.remove(name);
  } else {
    this.add(name);
  }
  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var str = this.el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

});
require.register("component-truncate/index.js", function(exports, require, module){

/**
 * Expose `truncate`.
 */

exports = module.exports = truncate;

/**
 * Truncate the given string in less or equal length to the given characters
 * starting from LEFT side.
 *
 * @param {String} str
 * @param {Number} chars (default 200 chars)
 * @param {String} suffix string to add to summary
 * @return {Object}
 */

function truncate(str, chars, suffix, left){
  suffix = 'string' == typeof chars ? chars : suffix;
  chars = 'number' == typeof chars ? chars : 200;

  suffix = suffix || '';
  if (!str || !str.length || str.length <= chars) return str;

  left = left !== false;
  var mod = false !== left ? 0 : 1;
  var end = !mod ? chars : str.length - chars;
  var new_str = str.substring(!mod ? 0 : str.length, end);
  var perfect = str[end] == ' ';

  if (!perfect) {
    new_str = new_str.replace(left ? /\s*[^\s|.]*$/ : /^[^\s|.]*\s*/, '');
  }
  return left ? new_str + suffix : suffix + new_str;
}

/**
 * See <truncate>
 */

exports.left = truncate;

/**
 * Truncate the given string in less or equal length to the given characters
 * starting from RIGHT side.
 *
 * @param {String} str
 * @param {Number} chars (default 200 chars)
 * @param {String} prefix string prefix to add to summary
 * @api public
 */

exports.right = function(str, chars, prefix){
  return truncate(str, chars, prefix, false);
};

});
require.register("remy-polyfills/classList.js", function(exports, require, module){
(function () {

if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

var prototype = Array.prototype,
    indexOf = prototype.indexOf,
    slice = prototype.slice,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join;

function DOMTokenList(el) {  
  this._element = el;
  if (el.className != this._classCache) {
    this._classCache = el.className;

    if (!this._classCache) return;
    
      // The className needs to be trimmed and split on whitespace
      // to retrieve a list of classes.
      var classes = this._classCache.replace(/^\s+|\s+$/g,'').split(/\s+/),
        i;
    for (i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  }
};

function setToClassName(el, classes) {
  el.className = classes.join(' ');
}

DOMTokenList.prototype = {
  add: function(token) {
    if(this.contains(token)) return;
    push.call(this, token);
    setToClassName(this._element, slice.call(this, 0));
  },
  contains: function(token) {
    return indexOf.call(this, token) !== -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    var i = indexOf.call(this, token);
     if (i === -1) {
       return;
     }
    splice.call(this, i, 1);
    setToClassName(this._element, slice.call(this, 0));
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (!this.contains(token)) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return this.contains(token);
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
	if (Object.defineProperty) {
		Object.defineProperty(obj, prop,{
			get : getter
		})
	} else {					
		obj.__defineGetter__(prop, getter);
	}
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);			
});

})();

});
require.register("remy-polyfills/dataset.js", function(exports, require, module){
(function () {  
  var forEach = [].forEach, 
      regex = /^data-(.+)/,
      dashChar = /\-([a-z])/ig,
      el = document.createElement('div'),
      mutationSupported = false,
      match
  ;

  function detectMutation() {
    mutationSupported = true;
    this.removeEventListener('DOMAttrModified', detectMutation, false);
  }
  
  function toCamelCase(s) {
    return s.replace(dashChar, function (m,l) { return l.toUpperCase(); });
  }
  
  function updateDataset() {
    var dataset = {};
    forEach.call(this.attributes, function(attr) {
      if (match = attr.name.match(regex))
        dataset[toCamelCase(match[1])] = attr.value;
    });
    return dataset;    
  }

  // only add support if the browser doesn't support data-* natively
  if (el.dataset != undefined) return;

  el.addEventListener('DOMAttrModified', detectMutation, false);
  el.setAttribute('foo', 'bar');

  Element.prototype.__defineGetter__('dataset', mutationSupported
    ? function () {
      if (!this._datasetCache) {
        this._datasetCache = updateDataset.call(this);
      }
      return this._datasetCache;
    }
    : updateDataset
  );

  document.addEventListener('DOMAttrModified', function (event) {
    delete event.target._datasetCache;
  }, false);
})();
});
require.register("remy-polyfills/device-motion-polyfill.js", function(exports, require, module){
/**
 * DeviceMotion and DeviceOrientation polyfill
 * by Remy Sharp / leftlogic.com
 * MIT http://rem.mit-license.org
 *
 * Usage: used for testing motion events, include
 * script in head of test document and allow popup
 * to open to control device orientation.
 */
(!document.DeviceOrientationEvent || !document.DeviceMotionEvent) && (function () {

// thankfully we don't have to do anything, because the event only fires on the window object
var polyfill = {
  motion: !document.DeviceMotionEvent,
  orientation: !document.DeviceOrientationEvent
};

if (polyfill.orientation) window.DeviceOrientationEvent = function () {};

if (polyfill.motion) window.DeviceMotionEvent = function () {};

// images - yes I do like to be self contained don't I?! :)
var imageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAACpCAYAAABEbEGLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxODkwMDQ2NTNDNEYxMUUxQTYyOTk2M0QwMjU4OThGOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxODkwMDQ2NjNDNEYxMUUxQTYyOTk2M0QwMjU4OThGOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE4OTAwNDYzM0M0RjExRTFBNjI5OTYzRDAyNTg5OEY4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE4OTAwNDY0M0M0RjExRTFBNjI5OTYzRDAyNTg5OEY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jKamsAAAAtNJREFUeNrs2t1t01AYgGG3dACPkA3qEcIlV5QJSCdAnaAwAWKCsgFs0HQChwmaS+6SThCOKwuigtP4J+ln9LzSRyWaRMmTE8fHcJLt3yRNkeY8U9VDmkWa+ZAPOktTptmYf84qzU29GDtXQG49111XM7xuUy3QfF/oa2DHAbeijwReABp8vjVh+zI8zFw4fBxv7q3qF1jdp1s7Qx2ut9UfZ0Gh+26BJ313dANXRDuvXg38xuf1NjrKoeTxMBKlq/rCzlCt01zWP0N0GujjtjzQ4y4iYS+DPJd8ZI/bCTtKHw7wmLNIJwBngbCn9QZgOcDZSF4/XqgzrUjY26ds0//xZPs0E2zYgg1bsGHDFuwRt2sHOcfTqSJruPi1C/s1t07dZg2XGxxGHLNhCzZswYYNW7BhCzZs2IINW7BhCzZs2IINW7BhwxZs2IINW7BhwxZs2IING7ZgwxZs2IING7ZgwxZs2LAFG7Zgw4Yt2LAFG7Zgw4Yt2LAFGzZswYYt2LAFGzZswYYt2LBhCzZswYYt2LBhCzZswYYNW7BhCzZs2IINW7BhCzZs2IINW7BhwxZs2IIdvbMdv7vG06lJF+yP3BxGYAs2bGcj8VukmadZb/1dkWaaJh/Li6hO8TaB57YGbSofwWvYjAH7psWiqd6QVWTsyMfsr2kuW9x+3vL2viDrlmmuOtzve/0mwW7RlydfhG36BLv9Cu3zqVjCbgf2kve3qRl5OezjtY6KPXnh+x/sMPIj4POa9oSOhr3YfnLRdlv3PV7YTfSdcBnwCX7uAF0E3apfbD/JWdAnOWsJvRrLp7TM4l6Meu4S6kXgi1C/V/XJk5VRRj1tqq953GV/X89+X/+MuhN+1/TLqIeTMU759BP5quEUZZqp7+WCN2l+7nNjK3zAFb3vt3sJr9X0/l9kM+g7Z1WfMT27az1puQ2uVvu5Q/JjD9mff/Hfq18CDADFyFpnRW9JPwAAAABJRU5ErkJggg==';

var imageBackSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAACpCAIAAADLDtbcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3OTFCRTMwQTNDNjMxMUUxQTYyOTk2M0QwMjU4OThGOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3OTFCRTMwQjNDNjMxMUUxQTYyOTk2M0QwMjU4OThGOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE4OTAwNDZCM0M0RjExRTFBNjI5OTYzRDAyNTg5OEY4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE4OTAwNDZDM0M0RjExRTFBNjI5OTYzRDAyNTg5OEY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+zWf2VgAABt9JREFUeNrsnU1PGlscxgHpi1aLtTGxpg0kdtWNpO7VTyAfoYmuXbmGha7ZsDep7knarmtSP4AJLo1NgwtvNCqUVI1vhfvIaei5/3mBgeHgZZ4nKcJwOGfO7/zfZmCm4VqtFnJWsVjcrSv0/1csFksmk3Nzc+7Nwk5ENjY2crlcf7DQNTo6mkql0ul0IpFolQgoLC4u9h8LoUxdzYnANJaWlkLB0PT09NbWFqzGkchqXaEgyQrlL5FAWYcLlD9EEDVmZmZCQRVibT6f/w8R4Oj7UOouEAGXP0QC6y+6kIy/f/+OJxH8Q90RCrxQi37+/PmeiKpKSQT68uULHqOGcTQtooUODg6wZmb2rVAomCOC3IYMhzzXxmd//vy5srKCYNftnVQoImbwZ7PZ9nAomuvr66Ky7J4iMEszkbzzOsoQkXg8bmAYWH7Pe2iViJlhOkzwCCLGMkDUzDDb29tv376FPXrNNZVK5du3byYTYtTYSMW6gOaBVyWREEUiJEIiJNLdXOP+9U3/KRwOuxGpVqtBIxKJRAQUeg3jSBs16+PHjwMy+bu7u5aIvHjxIiBEyuWyFQq9hnGEREiEREiEREiEREiEREiEREiEREiERCgSIRESIRESIRESIRESIRESIRESIRESIRGKREiEREiEREjEpDxflRaLxfSfAF9eXl5cXODJ+Pi43uzm5qZSqehbnj59OjIygsdI5H4Zbm9v8UHRRunZs2dDQ0O2o5+cnFg3os8nT57Y/jDZuhv+ExkcHBwbG2u8/PXrly0RfbYDAwOTk5PAIboaHR3Fp46Pj9GJvh0t9SF0lUql379/6yxev37t8iNtJ+h+eo247tZpMXXF43ErDiVM5s2bNzAKfSMW3KkrIGg8f/ToEXr2/TfrnolcXV3BFBsvsf5Os1XCauvTsNWrV6/0l5iq4+5G/u7wy5cvMfqDiKzn5+fCyF0ai3dBc29vT4QDrLNuJi7LrsMV5gkH8eWK/3aIeHIcseAIqAgEiMeiWcNThAfBJJ16E6Z3enqqIloPiAjHwZK6+EWLft6wf90vID2OujtUj+sRT47jSQIubMrl3QdERDiOj0SEFYjcqYdS4VDRaLSXRITj+Lh0Vr/QB9LHEuF5YmLClzuHtM8VjuNUR+kS8V/EhaZeg/ZwHD0YNcwEdd3+/j5qPxWMsV1EZdNEWqnNVFJsvc+BuoQxVqtVMa7qs2nBatRrsN/dCHK2fYp4oZDh0Vqw+pJ927SR4eFhYdtO5aOwZLQUM3SJjrYupioXWIoY8fDwEGH43bt3vSHy/PlzsYxOPiyinXtlKdYcEQTd2pYkVmuyvVTVHBERRFCD+hLVxDzx0po+un05cjtxBNWHsFhrVe5X6u2kmTkiVnNwCQ1N063erMVo3VUzaYeICKvA4TJt20whDl6g6+tr29oMcceK2/YEil91c7QNwxZL5GIgaqq6TcEKUFxaaxl0YjUQ5A4Upvi4iCbAKgpZdSKmlYrRfxuxLoV7FXB2diYsyHoOCUdJaGNdeTVt6+QB1K/I1RUisAKX9sigSLfubnV8fCyO4vSEKg5/VUtsLJVK3SDSTvYVRqG8RmzUMaHBjx8/xsfHxf0z1YnyxslkzFN00uBoa4ZHR0c4tBmqy8Vnu07Eqb5yP6OHJf2nLviLsgXgEIuPGXod9KKu3ttIJ3IPww9B/E6PREiEREiEREiEREiEREiEREiEREiEREiEIhESIRESIRESIRESIRESIRESIRESIRESoUiEREiEREiEREiEREiEREiEREikn2VzNYnvV6w8WNleGWZDRNxtpc99xHJVaVS8zf9LPtq0BSMrcw3VNLKa1PT09Pz8fCwWUy93d3e3t7fFbaOCQmRubi6TyeBRbAeOXC63uroaLK/58OHD1taWFUeofkNOkMK74nLpfiYCHOvr600tqGmbPiGSSCSy2WwrLVOpFNj1P5Hl5eXW3SGdTvc/Eay8J4OC+t9rPLX35caArNDaF3I/icjcb5pIsVj01N6XGxV78xrU0SbHQ5HuCZ9Xgh0eUvSAyNraWpcad65kMnlPBMHfJBSs+crKSistcdS3sbFhksjCwsL9n1qt9vHjxwGzwog1VxUKBXU7eGOamppSQ4fUn/fv3xuGsri4WC6XbXF8+vTJMA4Ig6rRw+rEKkx0ZmbGfKrDkcvs7GyjrodpbG5uYmfMV9L5fF49DzdONcNpl5aWAliDIIzqJx/C+sn31boChQOJ5evXr/qxRVh8HREoSxHWYX9cA8fe2dkxXKT0RJlMBjO1npoIO31lBWPJ5XLmg5yBcI44mk6nnY7Cw+5f4qGg2q2rD1jEYjFUpbYnd3X9K8AA/k9UkZpuQLkAAAAASUVORK5CYII=';

var id = (+new Date).toString(32),
		body = document.documentElement, // yep - cheatin' Yud'up! :)
		height = 320;

// if the url hash doesn't contain tiltremote (our key) then fireup the popup, else we are the popup
if (window.location.hash.indexOf('tiltremote') === -1) {
	initServer();
} else {
	initRemote();
}

function initServer() {
	// old way didn't work. Shame, but I like the new way too :)
	// var remote = window.open('data:text/html,<script src="' + src + '?tiltremote"></script>', 'Tilt', 'width=300,height=' + height);
	
	var remote = window.open(window.location.toString() + '#tiltremote', 'Tilt', 'width=300,height=' + height);
	if (!remote) {
		alert('The remote control for the orientation event uses a popup')
	}

	// TODO add remote-tilt.com support
}

function initRemote() {
	var TO_RADIANS = Math.PI / 180;
			orientation = {
				alpha: 180,
				beta: 0,
				gamma: 0
			},
			accelerationIncludingGravity = { x: 0, y: 0, z: -9.81 },
			guid = (+new Date).toString(32);	

	function update(fromInput) {
		var preview = document.getElementById('preview');
		preview.style.webkitTransform = 'rotateY('+ gamma.value + 'deg) rotate3d(1,0,0, '+ (beta.value*-1) + 'deg)';
  	preview.parentNode.style.webkitTransform = 'rotate(' + (180-orientation.alpha) + 'deg)';

    if (!fromInput) {
    	for (var key in orientation) {
    		var el = document.getElementById(key);
    		oninput.call(window, { target: el });
    	}
    }

    fireEvent();
	}

	function fireDeviceOrienationEvent() {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('deviceorientation', true, true);
    event.eventName = 'deviceorientation';
    event.alpha = orientation.alpha;
    event.beta = orientation.beta;
    event.gamma = orientation.gamma;
    
    window.opener.dispatchEvent(event);
	}

	function fireDeviceMotionEvent() {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('devicemotion', true, true);
    event.eventName = 'devicemotion';

    event.accelerationIncludingGravity = {};
    event.accelerationIncludingGravity.x = accelerationIncludingGravity.x;
    event.accelerationIncludingGravity.y = accelerationIncludingGravity.y;
    event.accelerationIncludingGravity.z = accelerationIncludingGravity.z;
    
    window.opener.dispatchEvent(event);
	}

	function fireEvent() {
		if (polyfill.orientation) fireDeviceOrienationEvent();
		if (polyfill.motion) fireDeviceMotionEvent();
	}

	// hides the old body - but doesn't prevent the JavaScript from running.
  // just a clean up thing - lame, but tidier
	setTimeout(function () {
		var bodies = document.getElementsByTagName('body'),
				body = bodies[1];
		if (bodies.length == 2) {
			if (body.id == guid) body = bodies[0];
		}
		document.documentElement.removeChild(body);
	});

	body.innerHTML = ['<head><title>Motion Emulator</title>',
		'<style>',
		'html { height: ' + height + 'px; }',
		'body { margin: 10px; font-family: sans-serif; overflow: hidden; }',
		'#pov { height: 170px; position: relative; -webkit-perspective: 500; perspective: 500; cursor: move; }',
		'#controls { position: relative; z-index: 1; }',
		'#preview { display: block; margin: 20px auto; max-width: 100%; width: 100px; height: 170px;  }',
		'#preview div { width: 100%; height: 170px; position: absolute; top: 0; left: 0; -webkit-backface-visibility: hidden; }',
		'#front { background: url(' + imageSrc + ') no-repeat center; }',
		'#back { background: url(' + imageBackSrc + ') no-repeat center; -webkit-transform: rotateY(180deg); }',
		'label { display: block; clear: both; }',
		'label input[type=range] { display:inline-block; float: right; }',
		'#buttons { margin-top: 2px; }',
		'#south { position: absolute; bottom: 0; width: 100%; left: 0; text-align: center; color: #aaa; }',
		'</style>',
		'</head>',
		'<body id="' + guid + '">',
		'<div id=controls>',
		'<label for=gamma>Left - Right <input min=-180 max=180 id=gamma value=0 type=range step=0.001>  <output id=og>0</output></label>',
		'<label for=beta>Back - Front <input min=-180 max=180 id=beta value=0 type=range step=0.001> <output id=ob>0</output></label>',
		'<label for=alpha>Rotate <input min=0 max=360 id=alpha value=180 type=range step=0.001> <output id=oa>180</output></label>',
		'<label for=wobble>Emulate slight shake<input type=checkbox id=wobble></label>',
		'<div id=buttons><button id=flat>Flat on it\'s back</button> ',
		'</div>',
		'</div>', // end of controls
		'<div id=pov>',
			'<div id=preview>',
				'<div id=front></div>',
				'<div id=back></div>',
			'</div>',
		'</div>',
		'<span id=south>south</span>',
		'</body>'
	].join('');

	function oninput(event) {
		var target = event.target;
		if (target.nodeName == 'INPUT') {

			var value = target.value * 1;

			if (target.id == 'beta') {
				// parseFloat + toFixed avoids the massive 0.00000000 and infinitely small numbers
				accelerationIncludingGravity.z = parseFloat( (Math.sin( (TO_RADIANS * (value - 90))) * 9.81).toFixed(10) );
				accelerationIncludingGravity.y = parseFloat((Math.sin( (TO_RADIANS * (value - 180))) * 9.81).toFixed(10));
				value = parseFloat((Math.sin(value * TO_RADIANS) * 90).toFixed(10));
			} else if (target.id == 'gamma') {
				accelerationIncludingGravity.x = parseFloat( (Math.sin( (TO_RADIANS * (value - 180))) * -9.81).toFixed(10) );
			}

			document.getElementById('o' + target.id.substring(0, 1)).value = parseFloat(value.toFixed(2));

			orientation[target.id] = value;

			if (this !== window) update(true); // i.e. if not called manually
		} 
	}

	body.addEventListener('input', oninput, false);

	var down = false,
			last = { x: null, y: null },
			pov = document.getElementById('pov'),
			alpha = document.getElementById('alpha'),
			beta = document.getElementById('beta'),
			gamma = document.getElementById('gamma');
	
	pov.addEventListener('mousedown', function (event) {
		down = true;
		last.x = event.pageX;
		last.y = event.pageY;
		event.preventDefault();
	}, false);

	body.addEventListener('mousemove', function (event) {
		if (down) {
			var dx = (last.x - event.pageX)// * 0.1,
					dy = (last.y - event.pageY); // * 0.1;
			last.x = event.pageX;
			last.y = event.pageY;
			gamma.value -= dx;
			beta.value -= dy;
			update();
		}
	}, false);

	body.addEventListener('mouseup', function (event) {
		down = false;
	}, false);

	body.addEventListener('click', function (event) {
		var target = event.target;	
		if (target.nodeName == 'BUTTON') {
			if (target.id == 'flat') {
				alpha.value = 180;
				beta.value = 0;
				gamma.value = 0;
				
			}
			update();
		} else if (target.id == 'wobble') {
			if (target.checked) startShake();
			else stopShake();
		}
	}, false);

	function startShake() {
		shake = setInterval(function () {
			alpha.value = parseFloat(alpha.value) + (Math.random() * (Math.random() < 0.5 ? 1 : -1) * 0.05);
			beta.value = parseFloat(beta.value) + (Math.random() * (Math.random() < 0.5 ? 1 : -1) * 0.05);
			gamma.value = parseFloat(gamma.value) + (Math.random() * (Math.random() < 0.5 ? 1 : -1) * 0.05);	
			update();
		}, 100);
	}

	function stopShake() {
		clearInterval(shake);
	}

	update();
}

})();

















});
require.register("remy-polyfills/EventSource.js", function(exports, require, module){
;(function (global) {

if ("EventSource" in global) return;

var reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

var EventSource = function (url) {
  var eventsource = this,  
      interval = 500, // polling interval  
      lastEventId = null,
      cache = '';

  if (!url || typeof url != 'string') {
    throw new SyntaxError('Not enough arguments');
  }

  this.URL = url;
  this.readyState = this.CONNECTING;
  this._pollTimer = null;
  this._xhr = null;
  
  function pollAgain(interval) {
    eventsource._pollTimer = setTimeout(function () {
      poll.call(eventsource);
    }, interval);
  }
  
  function poll() {
    try { // force hiding of the error message... insane?
      if (eventsource.readyState == eventsource.CLOSED) return;

      // NOTE: IE7 and upwards support
      var xhr = new XMLHttpRequest();
      xhr.open('GET', eventsource.URL, true);
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      // we must make use of this on the server side if we're working with Android - because they don't trigger 
      // readychange until the server connection is closed
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if (lastEventId != null) xhr.setRequestHeader('Last-Event-ID', lastEventId);
      cache = '';
    
      xhr.timeout = 50000;
      xhr.onreadystatechange = function () {
        if (this.readyState == 3 || (this.readyState == 4 && this.status == 200)) {
          // on success
          if (eventsource.readyState == eventsource.CONNECTING) {
            eventsource.readyState = eventsource.OPEN;
            eventsource.dispatchEvent('open', { type: 'open' });
          }

          var responseText = '';
          try {
            responseText = this.responseText || '';
          } catch (e) {}
        
          // process this.responseText
          var parts = responseText.substr(cache.length).split("\n"),
              eventType = 'message',
              data = [],
              i = 0,
              line = '';
            
          cache = responseText;
        
          // TODO handle 'event' (for buffer name), retry
          for (; i < parts.length; i++) {
            line = parts[i].replace(reTrim, '');
            if (line.indexOf('event') == 0) {
              eventType = line.replace(/event:?\s*/, '');
            } else if (line.indexOf('retry') == 0) {                           
              retry = parseInt(line.replace(/retry:?\s*/, ''));
              if(!isNaN(retry)) { interval = retry; }
            } else if (line.indexOf('data') == 0) {
              data.push(line.replace(/data:?\s*/, ''));
            } else if (line.indexOf('id:') == 0) {
              lastEventId = line.replace(/id:?\s*/, '');
            } else if (line.indexOf('id') == 0) { // this resets the id
              lastEventId = null;
            } else if (line == '') {
              if (data.length) {
                var event = new MessageEvent(data.join('\n'), eventsource.url, lastEventId);
                eventsource.dispatchEvent(eventType, event);
                data = [];
                eventType = 'message';
              }
            }
          }

          if (this.readyState == 4) pollAgain(interval);
          // don't need to poll again, because we're long-loading
        } else if (eventsource.readyState !== eventsource.CLOSED) {
          if (this.readyState == 4) { // and some other status
            // dispatch error
            eventsource.readyState = eventsource.CONNECTING;
            eventsource.dispatchEvent('error', { type: 'error' });
            pollAgain(interval);
          } else if (this.readyState == 0) { // likely aborted
            pollAgain(interval);
          } else {
          }
        }
      };
    
      xhr.send();
    
      setTimeout(function () {
        if (true || xhr.readyState == 3) xhr.abort();
      }, xhr.timeout);
      
      eventsource._xhr = xhr;
    
    } catch (e) { // in an attempt to silence the errors
      eventsource.dispatchEvent('error', { type: 'error', data: e.message }); // ???
    } 
  };
  
  poll(); // init now
};

EventSource.prototype = {
  close: function () {
    // closes the connection - disabling the polling
    this.readyState = this.CLOSED;
    clearInterval(this._pollTimer);
    this._xhr.abort();
  },
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
  dispatchEvent: function (type, event) {
    var handlers = this['_' + type + 'Handlers'];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(this, event);
      }
    }

    if (this['on' + type]) {
      this['on' + type].call(this, event);
    }
  },
  addEventListener: function (type, handler) {
    if (!this['_' + type + 'Handlers']) {
      this['_' + type + 'Handlers'] = [];
    }
    
    this['_' + type + 'Handlers'].push(handler);
  },
  removeEventListener: function (type, handler) {
    var handlers = this['_' + type + 'Handlers'];
    if (!handlers) {
      return;
    }
    for (var i = handlers.length - 1; i >= 0; --i) {
      if (handlers[i] === handler) {
        handlers.splice(i, 1);
        break;
      }
    }
  },
  onerror: null,
  onmessage: null,
  onopen: null,
  readyState: 0,
  URL: ''
};

var MessageEvent = function (data, origin, lastEventId) {
  this.data = data;
  this.origin = origin;
  this.lastEventId = lastEventId || '';
};

MessageEvent.prototype = {
  data: null,
  type: 'message',
  lastEventId: '',
  origin: ''
};

if ('module' in global) module.exports = EventSource;
global.EventSource = EventSource;
 
})(this);

});
require.register("remy-polyfills/index.js", function(exports, require, module){
require( "./classList.js" );
require( "./dataset.js" );
require( "./EventSource.js" );
require( "./input-target.js" );
require( "./offline-events.js" );
require( "./range.js" );
require( "./sessionStorage.js" );
require( "./Storage.js" );
});
require.register("remy-polyfills/input-target.js", function(exports, require, module){
(function () {
  
// setup for detection
var form = document.createElement('form'),
    input = document.createElement('input'),
    body = document.body,
    id = 'f' + +new Date,
    inputTargetSupported = false;

// insert into DOM, work out if it's supported
form.setAttribute('id', id);
input.setAttribute('form', id);
body.appendChild(form);
body.appendChild(input);

inputTargetSupported = input.form !== null;
body.removeChild(form);
body.removeChild(input);

// if not, hook click handlers to all existing submit elements
function click(event) {
  event = event || window.event;
  
  // http://www.quirksmode.org/js/events_properties.html#target
  var target = event.target || event.srcElement;
	if (target.nodeType === 3) target = target.parentNode;
	
	if (target.nodeName === 'INPUT' && target.type === 'submit' && target.form === null) {
	  form = document.getElementById(target.getAttribute('form'));
	  var clone = target.cloneNode(true);
	  clone.style.display = 'none';
	  form.appendChild(clone);
	  clone.click(); // doing this because form.submit won't fire handles the way I want
	  form.removeChild(clone);
	}
}

if (!inputTargetSupported) {
  body.addEventListener ? body.addEventListener('click', click, false) : body.attachEvent('onclick', click);
}

})();

});
require.register("remy-polyfills/offline-events.js", function(exports, require, module){
// Working demo: http://jsbin.com/ozusa6/2/
(function () {

function triggerEvent(type) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent(type, true, true);
  event.eventName = type;
  (document.body || window).dispatchEvent(event);
}

function testConnection() {
  // make sync-ajax request
  var xhr = new XMLHttpRequest();
  // phone home
  xhr.open('HEAD', '/', false); // async=false
  try {
    xhr.send();
    onLine = true;
  } catch (e) {
    // throws NETWORK_ERR when disconnected
    onLine = false;
  }

  return onLine; 
}

var onLine = true,
    lastOnLineStatus = true;

// note: this doesn't allow us to define a getter in Safari
navigator.__defineGetter__("onLine", testConnection);
testConnection();

if (onLine === false) {
  lastOnLineStatus = false;
  // trigger offline event
  triggerEvent('offline');
}

setInterval(function () {
  testConnection();
  if (onLine !== lastOnLineStatus) {
    triggerEvent(onLine ? 'online' : 'offline');
    lastOnLineStatus = onLine;
  }
}, 5000); // 5 seconds, made up - can't find docs to suggest interval time
})();

});
require.register("remy-polyfills/range.js", function(exports, require, module){
/**
 * This was from a proposal that James Edwards / Brothercake had during
 * 2011 Highland Fling - to use select elements as a starting point for
 * the range element - so it's a pretty darn good fit, I put this together
 * during his Q&A. In the end I needed to lift the detection code from 
 * Modernizr - which credit really goes to @miketaylr.
 * My code starts from "if (bool) {"
 *
 * This code is looking for <select type="range"> and will progressively
 * enhance to a input[type=range] copying much of the attributes across.
 */
!function () {
var rangeTest = document.createElement('input'),
    smile = ':)';
rangeTest.setAttribute('type', 'range');

var bool = rangeTest.type !== 'text';
if (bool) {
  rangeTest.style.cssText = 'position:absolute;visibility:hidden;';
  rangeTest.value = smile;
  if (rangeTest.style.WebkitAppearance !== undefined ) {

    document.body.appendChild(rangeTest);
    defaultView = document.defaultView;

    // Safari 2-4 allows the smiley as a value, despite making a slider
    bool =  defaultView.getComputedStyle &&
            defaultView.getComputedStyle(rangeTest, null).WebkitAppearance !== 'textfield' &&
            // Mobile android web browser has false positive, so must
            // check the height to see if the widget is actually there.
            (rangeTest.offsetHeight !== 0);

    document.body.removeChild(rangeTest);
  }
} else {
  bool = rangeTest.value == smile;
}

// if the input[range] is natively supported, then upgrade the <select type="range">
// into a range element.
if (bool) {
 function firstChild(el, nodeName) {
    nodeName = nodeName.toUpperCase();
    if (el.firstChild.nodeName === nodeName) {
      return el.firstChild;
    } else {
      return el.firstChild.nextSibling;
    }
  }

  function lastChild(el, nodeName) {
    nodeName = nodeName.toUpperCase();
    if (el.lastChild.nodeName === nodeName) {
      return el.lastChild;
    } else {
      return el.lastChild.previousSibling;
    }
  }

 var selects = document.getElementsByTagName('select'),
     i = 0;

  for (; i < selects.length; i++) {
    if (selects[i].getAttribute('data-type') == 'range') (function (select) {
      var range = document.createElement('input'),
          parent = select.parentNode;
          
      range.setAttribute('type', 'range');
      // works with the select element removed from the DOM
      select = parent.replaceChild(range, select);
      range.autofocus = select.autofocus;
      range.disabled = select.disabled;
      range.autocomplete = select.autocomplete; // eh? how would this even work?
      range.className = select.className;
      range.id = select.id;
      range.style = select.style;
      range.tabindex = select.tabindex;
      range.title = select.title;
      range.min = firstChild(select, 'option').value;
      range.max = lastChild(select, 'option').value;
      range.value = select.value;
      // Add step support
      if ( select.getAttribute('data-type-range-step') ) {
        range.step = select.getAttribute('data-type-range-step');
      }
      // yeah, this is filth, but it's because getElementsByTagName is
      // a live DOM collection, so when we removed the select element
      // the selects object reduced in length. Freaky, eh?
      i--;
    })(selects[i]);
  }
}
}();
});
require.register("remy-polyfills/sessionStorage.js", function(exports, require, module){
if (!sessionStorage && JSON) {
  sessionStorage = (function () {
    var data = window.name ? JSON.parse(window.name) : {};

    return {
      clear: function () {
        data = {};
        window.name = '';
      },
      getItem: function (key) {
        return data[key] === undefined ? null : data[key];
      },
      removeItem: function (key) {
        delete data[key];
        window.name = JSON.stringify(data);
      },
      setItem: function (key, value) {
        data[key] = value;
        window.name = JSON.stringify(data);
      }
    };
  })();
}

});
require.register("remy-polyfills/Storage.js", function(exports, require, module){
if (typeof window.localStorage == 'undefined' || typeof window.sessionStorage == 'undefined') (function () {

var Storage = function (type) {
  function createCookie(name, value, days) {
    var date, expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
    var nameEQ = name + "=",
        ca = document.cookie.split(';'),
        i, c;

    for (i=0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1,c.length);
      }

      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }
    return null;
  }
  
  function setData(data) {
    data = JSON.stringify(data);
    if (type == 'session') {
      window.name = data;
    } else {
      createCookie('localStorage', data, 365);
    }
  }
  
  function clearData() {
    if (type == 'session') {
      window.name = '';
    } else {
      createCookie('localStorage', '', 365);
    }
  }
  
  function getData() {
    var data = type == 'session' ? window.name : readCookie('localStorage');
    return data ? JSON.parse(data) : {};
  }


  // initialise if there's already data
  var data = getData();

  return {
    length: 0,
    clear: function () {
      data = {};
      this.length = 0;
      clearData();
    },
    getItem: function (key) {
      return data[key] === undefined ? null : data[key];
    },
    key: function (i) {
      // not perfect, but works
      var ctr = 0;
      for (var k in data) {
        if (ctr == i) return k;
        else ctr++;
      }
      return null;
    },
    removeItem: function (key) {
      delete data[key];
      this.length--;
      setData(data);
    },
    setItem: function (key, value) {
      data[key] = value+''; // forces the value to a string
      this.length++;
      setData(data);
    }
  };
};

if (typeof window.localStorage == 'undefined') window.localStorage = new Storage('local');
if (typeof window.sessionStorage == 'undefined') window.sessionStorage = new Storage('session');

})();

});
require.register("javascript-augment/lib/augment.js", function(exports, require, module){
var augment = (function (bind, call) {
    "use strict";

    var bindable = Function.bindable = bind.bind(bind);
    var callable = Function.callable = bindable(call);

    var arrayFrom = Array.from = callable(Array.prototype.slice);
    var ownPropertyOf = Object.ownPropertyOf = callable(Object.hasOwnProperty);

    var defineProperty = Object.defineProperty;
    var augmentDescriptor = { value: augment };

    defineProperty(Function.prototype, "augment", augmentDescriptor);
    defineProperty(Object.prototype, "augment", augmentDescriptor);

    return callable(augment);

    function augment(body) {
        var base = typeof this === "function" ? this.prototype : this;
        var prototype = Object.create(base);
        body.apply(prototype, arrayFrom(arguments, 1).concat(base));
        if (!ownPropertyOf(prototype, "constructor")) return prototype;
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    }
}(Function.bind, Function.call));

if (typeof module === "object") module.exports = augment;
});
require.register("segmentio-extend/index.js", function(exports, require, module){

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};
});
require.register("DamonOehlman-stylar/index.js", function(exports, require, module){
/* ~stylar~
 * 
 * Simple Object Query Language
 * 
 * -meta---
 * version:    0.1.5
 * builddate:  2012-10-30T04:14:02.461Z
 * generator:  interleave@0.5.23
 * 
 * 
 * 
 */ 

// umdjs returnExports pattern: https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root['stylar'] = factory();
    }
}(this, function () {
    var prefixes = ['ms', 'o', 'Moz', 'webkit', ''],
        knownKeys = {},
        getComputed = null,
        reDash = /^(\w+)\-(\w)/,
        reVendorPrefixes = /^\-\w+\-/;
        
    if (document.defaultView && typeof document.defaultView.getComputedStyle == 'function') {
        getComputed = document.defaultView.getComputedStyle;
    }
        
    function sniffProperty(element, attribute) {
        var dashMatch, ii, prefix, prefixedAttr;
        
        // strip off css vendor prefixes
        attribute = attribute.replace(reVendorPrefixes, '');
        
        // convert delimiting dashes into camel case ids
        dashMatch = reDash.exec(attribute);
        while (dashMatch) {
            attribute = dashMatch[1] + dashMatch[2].toUpperCase() + attribute.slice(dashMatch[0].length);
            dashMatch = reDash.exec(attribute);
        }
        
        // search the known prefix
        for (ii = prefixes.length; ii--; ) {
            prefix = prefixes[ii];
            prefixedAttr = prefix ? (prefix + attribute[0].toUpperCase() + attribute.slice(1)) : attribute;
                
            if (typeof element.style[prefixedAttr] != 'undefined') {
                return knownKeys[attribute] = prefixedAttr;
            }
        }
        
        return attribute;
    }
    
    function stylar(elements, attribute, value) {
        var helpers = { get: getter, set: setter };
        
        if (typeof elements == 'string' || elements instanceof String) {
            elements = document.querySelectorAll(elements);
        }
        // if we don't have a splice function, then we don't have an array
        // make it one
        else if (typeof elements.length == 'undefined') {
            elements = [elements];
        } // if..else
        
        function getter(attr, ignoreComputed) {
            var readKey, style;
            
            // get the read key
            readKey = knownKeys[attr] || sniffProperty(elements[0], attr);
    
            // if we have the get computed function defined, and the opts.ignoreComputed is not set
            // then get the computed style fot eh element
            if (getComputed && (! ignoreComputed)) {
                style = getComputed.call(document.defaultView, elements[0]);
            }
            // otherwise, just return the style element 
            else {
                style = elements[0].style;
            }
                
            return style ? style[readKey] : '';
        }
        
        function setter(attr, val) {
            if (typeof attr == 'object' && (! (attr instanceof String))) {
                // if we have been passed an object, then iterate through the keys and update
                // each of the found values
                for (var key in attr) {
                    setter(key, attr[key]);
                }
            }
            else {
                var styleKey = knownKeys[attr] || sniffProperty(elements[0], attr);
    
                for (var ii = elements.length; ii--; ) {
                    elements[ii].style[styleKey] = val;
                }
            }
            
            return helpers;
        }
        
        // iterate through the elements
        
        // if we are in set mode, then update the attribute with the value
        if (typeof attribute == 'undefined') {
            return helpers;
        }
        else if (typeof value != 'undefined') {
            return setter(attribute, value);
        }
        else {
            return getter(attribute);
        }
    }
    
    stylar.sniffProperty = sniffProperty;
    
    return typeof stylar != 'undefined' ? stylar : undefined;
}));
});
require.register("jofan-draggy/lib/draggy.js", function(exports, require, module){
/**
 * draggy.js component
 *
 * A JavaScript/CSS3 microlibrary for moving elements.
 *
 * BROWSER SUPPORT: Safari, Chrome, Firefox, Opera, IE9
 *
 * @author     Stefan Liden
 * @version    0.9.3
 * @copyright  Copyright 2012 Stefan Liden (Jofan)
 * @license    MIT
 */

var stylar = require('stylar'),
    classes = require('classes');

/**
 * Expose `draggy`.
 */

module.exports = Draggy;

// TODO: Remove positioning with component dependencies
// TODO: Replace custom events with component events (or emitter)

var classes = require('classes');

// Some simple utility functions
var util = {
  // PPK script for getting position of element
  // http://www.quirksmode.org/js/findpos.html
  getPosition: function(ele) {
    var curleft = 0;
    var curtop = 0;
    if (ele.offsetParent) {
      do {
        curleft += ele.offsetLeft;
        curtop += ele.offsetTop;
      } while (ele = ele.offsetParent);
    }
    return [curleft,curtop];
  }
};

// Browser compatibility
var ele = document.createElement('div');

var d = document,
    isTouch = 'ontouchstart' in window,
    mouseEvents = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'        
    },
    touchEvents = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    },
    events = isTouch ? touchEvents : mouseEvents;

window.onDrag = d.createEvent('UIEvents');
window.onDrop = d.createEvent('UIEvents');
onDrag.initEvent('onDrag', true, true);
onDrop.initEvent('onDrop', true, true);

function Draggy(attachTo, config) {
  this.attachTo = attachTo;
  this.config   = config || {};
  this.onChange = this.config.onChange || function() {};
  this.position = [0,0];
  this.bindTo   = this.config.bindTo || null;
  this.init();
};

Draggy.prototype = {
  init: function() {
    this.ele           = (typeof this.attachTo === 'string' ? d.getElementById(this.attachTo) : this.attachTo);
    this.ele.draggy    = this;
    this.ele.onChange  = this.onChange;
    this.ele.position  = this.position || [0, 0];
    this.ele.restrictX = this.config.restrictX || false;
    this.ele.restrictY = this.config.restrictY || false;
    this.ele.limitsX   = this.config.limitsX || [-9999, 9999];
    this.ele.limitsY   = this.config.limitsY || [-9999, 9999];
    this.ele.snapBack  = this.config.snapBack || false;
    if (this.bindTo) {
      this.bind(this.bindTo);
    }
    this.enable();
  },
  // Reinitialize draggy object and move to saved position
  reInit: function() {
    this.init();
    this.setTo(this.ele.position[0], this.ele.position[1]);
  },
  // Disable the draggy object so that it can't be moved
  disable: function() {
    this.ele.removeEventListener(events.start, this.dragStart);
  },
  // Enable the draggy object so that it can be moved
  enable: function() {
    this.ele.addEventListener(events.start, this.dragStart);
  },
  // Get current state and prepare for moving object
  dragStart: function(e) {
    var restrictX = this.restrictX,
        restrictY = this.restrictY,
        limitsX = this.limitsX,
        limitsY = this.limitsY,
        relativeX = this.position[0],
        relativeY = this.position[1],
        posX = isTouch ? e.touches[0].pageX : e.clientX,
        posY = isTouch ? e.touches[0].pageY : e.clientY,
        newX, newY,
        self = this; // The DOM element

    // Allow nested draggable elements
    e.stopPropagation();

    classes(this).add('activeDrag');

    d.addEventListener(events.move, dragMove);
    d.addEventListener(events.end, dragEnd);
    
    // Move draggy object using CSS3 translate3d
    function dragMove (e) {
      e.preventDefault();
      var movedX, movedY, relX, relY,
          clientX = isTouch ? e.touches[0].pageX : e.clientX,
          clientY = isTouch ? e.touches[0].pageY : e.clientY;
      if (!restrictX) {
        // Mouse movement (x axis) in px
        movedX = clientX - posX;
        // New pixel value (x axis) of element
        newX = relativeX + movedX;
        if (newX >= limitsX[0] && newX <= limitsX[1]) {
          posX = clientX;
          relativeX = newX;
        }
        else if (newX < limitsX[0]) {
          relativeX = limitsX[0];
        }
        else if (newX > limitsX[1]) {
          relativeX = limitsX[1];
        }
      }
      if (!restrictY) {
        movedY = clientY - posY;
        newY = relativeY + movedY;
        if (newY >= limitsY[0] && newY <= limitsY[1]) {
          posY = clientY;
          relativeY = newY;
        }
        else if (newY < limitsY[0]) {
          relativeY = limitsY[0];
        }
        else if (newY > limitsY[1]) {
          relativeY = limitsY[1];
        }
      }
      self.draggy.position = self.position = [relativeX, relativeY];
      stylar(self).set('transform', 'translate(' + relativeX + 'px,' + relativeY + 'px)');
      self.onChange(relativeX, relativeY);
      self.dispatchEvent(onDrag);
    }
    // Stop moving draggy object, save position and dispatch onDrop event
    function dragEnd (e) {
      self.draggy.position = self.position;
      classes(self.draggy.ele).remove('activeDrag');
      self.dispatchEvent(onDrop);
      d.removeEventListener(events.move, dragMove);
      d.removeEventListener(events.end, dragEnd);
    }

  },
  // API method for moving the draggy object
  // Position is updated
  // Limits and restrictions are adhered to
  // Callback is NOT called
  // onDrop event is NOT dispatched
  moveTo: function(x,y) {
    x = this.ele.restrictX ? 0 : x;
    y = this.ele.restrictY ? 0 : y;
    if (x < this.ele.limitsX[0] || x > this.ele.limitsX[1]) { return; }
    if (y < this.ele.limitsY[0] || y > this.ele.limitsY[1]) { return; }
    stylar(this.ele).set('transform', 'translate(' + x + 'px,' + y + 'px)');
    this.ele.position = this.position = [x,y];
  },
  // API method for setting the draggy object at a certain point
  // Limits and restrictions are adhered to
  // Callback is called
  // onDrop event is dispatched
  setTo: function(x,y) {
    x = this.ele.restrictX ? 0 : x;
    y = this.ele.restrictY ? 0 : y;
    if (x < this.ele.limitsX[0] || x > this.ele.limitsX[1]) { return; }
    if (y < this.ele.limitsY[0] || y > this.ele.limitsY[1]) { return; }
    stylar(this.ele).set('transform', 'translate(' + x + 'px,' + y + 'px)');
    this.ele.onChange(x, y);
    this.ele.position = this.position = [x,y];
    this.ele.dispatchEvent(onDrop);
  },
  // API method for resetting position of draggy object
  reset: function() {
    stylar(this.ele).set('transform', 'translate(' + 0 + 'px,' + 0 + 'px)');
    this.ele.position = [0,0];
  },
  // API method for restricting draggy object to boundaries of an element
  // Sets x and y limits
  // Used internally if config option "bindTo" is used
  bind: function(element) {
    var ele = (typeof element === 'string' ? d.getElementById(element) : element),
        draggyPos, elePos, draggyWidth, eleWidth, draggyHeight, eleHeight,
        xLimit1,  xLimit2, yLimit1, yLimit2;

    xLimit1 = xLimit2 = yLimit1 = yLimit2 = 0;

    if (ele) {
      draggyPos    = util.getPosition(this.ele);
      elePos       = util.getPosition(ele);
      draggyWidth  = parseInt(this.ele.offsetWidth, 10);
      eleWidth     = parseInt(ele.offsetWidth, 10);
      draggyHeight = parseInt(this.ele.offsetHeight, 10);
      eleHeight    = parseInt(ele.offsetHeight, 10);
      if (!this.ele.restrictX) {
        xLimit1      = elePos[0] - draggyPos[0];
        xLimit2      = (eleWidth - draggyWidth) - Math.abs(xLimit1);
      }
      if (!this.ele.restrictY) {
        yLimit1      = elePos[1] - draggyPos[1];
        yLimit2      = (eleHeight - draggyHeight) - Math.abs(yLimit1);
      }

      this.ele.limitsX = [xLimit1, xLimit2];
      this.ele.limitsY = [yLimit1, yLimit2];

    }
  }
};


});
require.register("turbolinks/index.js", function(exports, require, module){
var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
  __hasProp = {}.hasOwnProperty,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pageCache = {};

cacheSize = 10;

currentState = null;

loadedAssets = null;

referer = null;

createDocument = null;

xhr = null;

fetchReplacement = function(url) {
  rememberReferer();
  cacheCurrentPage();
  triggerEvent('page:fetch', {
    url: url
  });
  if (xhr != null) {
    xhr.abort();
  }
  xhr = new XMLHttpRequest;
  xhr.open('GET', removeHashForIE10compatiblity(url), true);
  xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
  xhr.setRequestHeader('X-XHR-Referer', referer);
  xhr.onload = function() {
    var doc;
    triggerEvent('page:receive');
    if (doc = processResponse()) {
      reflectNewUrl(url);
      changePage.apply(null, extractTitleAndBody(doc));
      reflectRedirectedUrl();
      resetScrollPosition();
      return triggerEvent('page:load');
    } else {
      return document.location.href = url;
    }
  };
  xhr.onloadend = function() {
    return xhr = null;
  };
  xhr.onabort = function() {
    return rememberCurrentUrl();
  };
  xhr.onerror = function() {
    return document.location.href = url;
  };
  return xhr.send();
};

fetchHistory = function(cachedPage) {
  cacheCurrentPage();
  if (xhr != null) {
    xhr.abort();
  }
  changePage(cachedPage.title, cachedPage.body);
  recallScrollPosition(cachedPage);
  return triggerEvent('page:restore');
};

cacheCurrentPage = function() {
  pageCache[currentState.position] = {
    url: document.location.href,
    body: document.body,
    title: document.title,
    positionY: window.pageYOffset,
    positionX: window.pageXOffset
  };
  return constrainPageCacheTo(cacheSize);
};

pagesCached = function(size) {
  if (size == null) {
    size = cacheSize;
  }
  if (/^[\d]+$/.test(size)) {
    return cacheSize = parseInt(size);
  }
};

constrainPageCacheTo = function(limit) {
  var key, value;
  for (key in pageCache) {
    if (!__hasProp.call(pageCache, key)) continue;
    value = pageCache[key];
    if (key <= currentState.position - limit) {
      pageCache[key] = null;
    }
  }
};

changePage = function(title, body, csrfToken, runScripts) {
  document.title = title;
  document.documentElement.replaceChild(body, document.body);
  if (csrfToken != null) {
    CSRFToken.update(csrfToken);
  }
  removeNoscriptTags();
  if (runScripts) {
    executeScriptTags();
  }
  currentState = window.history.state;
  triggerEvent('page:change');
  return triggerEvent('page:update');
};

executeScriptTags = function() {
  var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
  scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
  for (_i = 0, _len = scripts.length; _i < _len; _i++) {
    script = scripts[_i];
    if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
      continue;
    }
    copy = document.createElement('script');
    _ref1 = script.attributes;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      attr = _ref1[_j];
      copy.setAttribute(attr.name, attr.value);
    }
    copy.appendChild(document.createTextNode(script.innerHTML));
    parentNode = script.parentNode, nextSibling = script.nextSibling;
    parentNode.removeChild(script);
    parentNode.insertBefore(copy, nextSibling);
  }
};

removeNoscriptTags = function() {
  var noscript, noscriptTags, _i, _len;
  noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
  for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
    noscript = noscriptTags[_i];
    noscript.parentNode.removeChild(noscript);
  }
};

reflectNewUrl = function(url) {
  if (url !== referer) {
    return window.history.pushState({
      turbolinks: true,
      position: currentState.position + 1
    }, '', url);
  }
};

reflectRedirectedUrl = function() {
  var location, preservedHash;
  if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
    preservedHash = removeHash(location) === location ? document.location.hash : '';
    return window.history.replaceState(currentState, '', location + preservedHash);
  }
};

rememberReferer = function() {
  return referer = document.location.href;
};

rememberCurrentUrl = function() {
  return window.history.replaceState({
    turbolinks: true,
    position: Date.now()
  }, '', document.location.href);
};

rememberCurrentState = function() {
  return currentState = window.history.state;
};

recallScrollPosition = function(page) {
  return window.scrollTo(page.positionX, page.positionY);
};

resetScrollPosition = function() {
  if (document.location.hash) {
    return document.location.href = document.location.href;
  } else {
    return window.scrollTo(0, 0);
  }
};

removeHashForIE10compatiblity = function(url) {
  return removeHash(url);
};

removeHash = function(url) {
  var link;
  link = url;
  if (url.href == null) {
    link = document.createElement('A');
    link.href = url;
  }
  return link.href.replace(link.hash, '');
};

popCookie = function(name) {
  var value, _ref;
  value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
  document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
  return value;
};

triggerEvent = function(name, data) {
  var event;
  event = document.createEvent('Events');
  if (data) {
    event.data = data;
  }
  event.initEvent(name, true, true);
  return document.dispatchEvent(event);
};

pageChangePrevented = function() {
  return !triggerEvent('page:before-change');
};

processResponse = function() {
  var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
  clientOrServerError = function() {
    var _ref;
    return (400 <= (_ref = xhr.status) && _ref < 600);
  };
  validContent = function() {
    return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
  };
  extractTrackAssets = function(doc) {
    var node, _i, _len, _ref, _results;
    _ref = doc.head.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
        _results.push(node.src || node.href);
      }
    }
    return _results;
  };
  assetsChanged = function(doc) {
    var fetchedAssets;
    loadedAssets || (loadedAssets = extractTrackAssets(document));
    fetchedAssets = extractTrackAssets(doc);
    return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
  };
  intersection = function(a, b) {
    var value, _i, _len, _ref, _results;
    if (a.length > b.length) {
      _ref = [b, a], a = _ref[0], b = _ref[1];
    }
    _results = [];
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      value = a[_i];
      if (__indexOf.call(b, value) >= 0) {
        _results.push(value);
      }
    }
    return _results;
  };
  if (!clientOrServerError() && validContent()) {
    doc = createDocument(xhr.responseText);
    if (doc && !assetsChanged(doc)) {
      return doc;
    }
  }
};

extractTitleAndBody = function(doc) {
  var title;
  title = doc.querySelector('title');
  return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
};

CSRFToken = {
  get: function(doc) {
    var tag;
    if (doc == null) {
      doc = document;
    }
    return {
      node: tag = doc.querySelector('meta[name="csrf-token"]'),
      token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
    };
  },
  update: function(latest) {
    var current;
    current = this.get();
    if ((current.token != null) && (latest != null) && current.token !== latest) {
      return current.node.setAttribute('content', latest);
    }
  }
};

browserCompatibleDocumentParser = function() {
  var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
  createDocumentUsingParser = function(html) {
    return (new DOMParser).parseFromString(html, 'text/html');
  };
  createDocumentUsingDOM = function(html) {
    var doc;
    doc = document.implementation.createHTMLDocument('');
    doc.documentElement.innerHTML = html;
    return doc;
  };
  createDocumentUsingWrite = function(html) {
    var doc;
    doc = document.implementation.createHTMLDocument('');
    doc.open('replace');
    doc.write(html);
    doc.close();
    return doc;
  };
  try {
    if (window.DOMParser) {
      testDoc = createDocumentUsingParser('<html><body><p>test');
      return createDocumentUsingParser;
    }
  } catch (_error) {
    e = _error;
    testDoc = createDocumentUsingDOM('<html><body><p>test');
    return createDocumentUsingDOM;
  } finally {
    if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
      return createDocumentUsingWrite;
    }
  }
};

installClickHandlerLast = function(event) {
  if (!event.defaultPrevented) {
    document.removeEventListener('click', handleClick, false);
    return document.addEventListener('click', handleClick, false);
  }
};

handleClick = function(event) {
  var link;
  if (!event.defaultPrevented) {
    link = extractLink(event);
    if (link.nodeName === 'A' && !ignoreClick(event, link)) {
      if (!pageChangePrevented()) {
        visit(link.href);
      }
      return event.preventDefault();
    }
  }
};

extractLink = function(event) {
  var link;
  link = event.target;
  while (!(!link.parentNode || link.nodeName === 'A')) {
    link = link.parentNode;
  }
  return link;
};

crossOriginLink = function(link) {
  return location.protocol !== link.protocol || location.host !== link.host;
};

anchoredLink = function(link) {
  return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
};

nonHtmlLink = function(link) {
  var url;
  url = removeHash(link);
  return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
};

noTurbolink = function(link) {
  var ignore;
  while (!(ignore || link === document)) {
    ignore = link.getAttribute('data-no-turbolink') != null;
    link = link.parentNode;
  }
  return ignore;
};

targetLink = function(link) {
  return link.target.length !== 0;
};

nonStandardClick = function(event) {
  return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
};

ignoreClick = function(event, link) {
  return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
};

installDocumentReadyPageEventTriggers = function() {
  triggerEvent('page:change');
  return triggerEvent('page:update');
};

installJqueryAjaxSuccessPageUpdateTrigger = function() {
  if (typeof jQuery !== 'undefined') {
    return $(document).on('ajaxSuccess', function(event, xhr, settings) {
      if (!$.trim(xhr.responseText)) {
        return;
      }
      return triggerEvent('page:update');
    });
  }
};

installHistoryChangeHandler = function(event) {
  var cachedPage, _ref;
  if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
    if (cachedPage = pageCache[event.state.position]) {
      return fetchHistory(cachedPage);
    } else {
      return visit(event.target.location.href);
    }
  }
};

initializeTurbolinks = function() {
  rememberCurrentUrl();
  rememberCurrentState();
  createDocument = browserCompatibleDocumentParser();
  document.addEventListener('click', installClickHandlerLast, true);
  document.addEventListener('DOMContentLoaded', installDocumentReadyPageEventTriggers, true);
  installJqueryAjaxSuccessPageUpdateTrigger();
  return window.addEventListener('popstate', installHistoryChangeHandler, false);
};

browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

if (browserSupportsTurbolinks) {
  visit = fetchReplacement;
  initializeTurbolinks();
} else {
  visit = function(url) {
    return document.location.href = url;
  };
}

this.Turbolinks = {
  visit: visit,
  pagesCached: pagesCached,
  supported: browserSupportsTurbolinks
};

});
require.register("spin.js/index.js", function(exports, require, module){
//fgnass.github.com/spin.js#v1.3.2

/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
    if(s[prop] !== undefined) return prop
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: 'auto',          // center vertically
    left: 'auto',         // center horizontally
    position: 'relative'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    if (typeof this == 'undefined') return new Spinner(o)
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width
        , ep // element position
        , tp // target position

      if (target) {
        target.insertBefore(el, target.firstChild||null)
        tp = pos(target)
        ep = pos(el)
        css(el, {
          left: (o.left == 'auto' ? tp.x-ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px',
          top: (o.top == 'auto' ? tp.y-ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid)  + 'px'
        })
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));

});
require.register("humane.js/index.js", function(exports, require, module){
/**
 * humane.js
 * Humanized Messages for Notifications
 * @author Marc Harter (@wavded)
 * @example
 *   humane.log('hello world');
 * See more usage examples at: http://wavded.github.com/humane-js/
 */

;!function (name, context, definition) {
   if (typeof module !== 'undefined') module.exports = definition(name, context)
   else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition)
   else context[name] = definition(name, context)
}('humane', this, function (name, context) {
   var win = window
   var doc = document

   var ENV = {
      on: function (el, type, cb) {
         'addEventListener' in win ? el.addEventListener(type,cb,false) : el.attachEvent('on'+type,cb)
      },
      off: function (el, type, cb) {
         'removeEventListener' in win ? el.removeEventListener(type,cb,false) : el.detachEvent('on'+type,cb)
      },
      bind: function (fn, ctx) {
         return function () { fn.apply(ctx,arguments) }
      },
      isArray: Array.isArray || function (obj) { return Object.prototype.toString.call(obj) === '[object Array]' },
      config: function (preferred, fallback) {
         return preferred != null ? preferred : fallback
      },
      transSupport: false,
      useFilter: /msie [678]/i.test(navigator.userAgent), // sniff, sniff
      _checkTransition: function () {
         var el = doc.createElement('div')
         var vendors = { webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' }

         for (var vendor in vendors)
            if (vendor + 'Transition' in el.style) {
               this.vendorPrefix = vendors[vendor]
               this.transSupport = true
            }
      }
   }
   ENV._checkTransition()

   var Humane = function (o) {
      o || (o = {})
      this.queue = []
      this.baseCls = o.baseCls || 'humane'
      this.addnCls = o.addnCls || ''
      this.timeout = 'timeout' in o ? o.timeout : 2500
      this.waitForMove = o.waitForMove || false
      this.clickToClose = o.clickToClose || false
      this.timeoutAfterMove = o.timeoutAfterMove || false 
      this.container = o.container

      try { this._setupEl() } // attempt to setup elements
      catch (e) {
        ENV.on(win,'load',ENV.bind(this._setupEl, this)) // dom wasn't ready, wait till ready
      }
   }

   Humane.prototype = {
      constructor: Humane,
      _setupEl: function () {
         var el = doc.createElement('div')
         el.style.display = 'none'
         if (!this.container){
           if(doc.body) this.container = doc.body;
           else throw 'document.body is null'
         }
         this.container.appendChild(el)
         this.el = el
         this.removeEvent = ENV.bind(function(){ if (!this.timeoutAfterMove){this.remove()} else {setTimeout(ENV.bind(this.remove,this),this.timeout);}},this)
         this.transEvent = ENV.bind(this._afterAnimation,this)
         this._run()
      },
      _afterTimeout: function () {
         if (!ENV.config(this.currentMsg.waitForMove,this.waitForMove)) this.remove()

         else if (!this.removeEventsSet) {
            ENV.on(doc.body,'mousemove',this.removeEvent)
            ENV.on(doc.body,'click',this.removeEvent)
            ENV.on(doc.body,'keypress',this.removeEvent)
            ENV.on(doc.body,'touchstart',this.removeEvent)
            this.removeEventsSet = true
         }
      },
      _run: function () {
         if (this._animating || !this.queue.length || !this.el) return

         this._animating = true
         if (this.currentTimer) {
            clearTimeout(this.currentTimer)
            this.currentTimer = null
         }

         var msg = this.queue.shift()
         var clickToClose = ENV.config(msg.clickToClose,this.clickToClose)

         if (clickToClose) {
            ENV.on(this.el,'click',this.removeEvent)
            ENV.on(this.el,'touchstart',this.removeEvent)
         }

         var timeout = ENV.config(msg.timeout,this.timeout)

         if (timeout > 0)
            this.currentTimer = setTimeout(ENV.bind(this._afterTimeout,this), timeout)

         if (ENV.isArray(msg.html)) msg.html = '<ul><li>'+msg.html.join('<li>')+'</ul>'

         this.el.innerHTML = msg.html
         this.currentMsg = msg
         this.el.className = this.baseCls
         if (ENV.transSupport) {
            this.el.style.display = 'block'
            setTimeout(ENV.bind(this._showMsg,this),50)
         } else {
            this._showMsg()
         }

      },
      _setOpacity: function (opacity) {
         if (ENV.useFilter){
            try{
               this.el.filters.item('DXImageTransform.Microsoft.Alpha').Opacity = opacity*100
            } catch(err){}
         } else {
            this.el.style.opacity = String(opacity)
         }
      },
      _showMsg: function () {
         var addnCls = ENV.config(this.currentMsg.addnCls,this.addnCls)
         if (ENV.transSupport) {
            this.el.className = this.baseCls+' '+addnCls+' '+this.baseCls+'-animate'
         }
         else {
            var opacity = 0
            this.el.className = this.baseCls+' '+addnCls+' '+this.baseCls+'-js-animate'
            this._setOpacity(0) // reset value so hover states work
            this.el.style.display = 'block'

            var self = this
            var interval = setInterval(function(){
               if (opacity < 1) {
                  opacity += 0.1
                  if (opacity > 1) opacity = 1
                  self._setOpacity(opacity)
               }
               else clearInterval(interval)
            }, 30)
         }
      },
      _hideMsg: function () {
         var addnCls = ENV.config(this.currentMsg.addnCls,this.addnCls)
         if (ENV.transSupport) {
            this.el.className = this.baseCls+' '+addnCls
            ENV.on(this.el,ENV.vendorPrefix ? ENV.vendorPrefix+'TransitionEnd' : 'transitionend',this.transEvent)
         }
         else {
            var opacity = 1
            var self = this
            var interval = setInterval(function(){
               if(opacity > 0) {
                  opacity -= 0.1
                  if (opacity < 0) opacity = 0
                  self._setOpacity(opacity);
               }
               else {
                  self.el.className = self.baseCls+' '+addnCls
                  clearInterval(interval)
                  self._afterAnimation()
               }
            }, 30)
         }
      },
      _afterAnimation: function () {
         if (ENV.transSupport) ENV.off(this.el,ENV.vendorPrefix ? ENV.vendorPrefix+'TransitionEnd' : 'transitionend',this.transEvent)

         if (this.currentMsg.cb) this.currentMsg.cb()
         this.el.style.display = 'none'

         this._animating = false
         this._run()
      },
      remove: function (e) {
         var cb = typeof e == 'function' ? e : null

         ENV.off(doc.body,'mousemove',this.removeEvent)
         ENV.off(doc.body,'click',this.removeEvent)
         ENV.off(doc.body,'keypress',this.removeEvent)
         ENV.off(doc.body,'touchstart',this.removeEvent)
         ENV.off(this.el,'click',this.removeEvent)
         ENV.off(this.el,'touchstart',this.removeEvent)
         this.removeEventsSet = false

         if (cb && this.currentMsg) this.currentMsg.cb = cb
         if (this._animating) this._hideMsg()
         else if (cb) cb()
      },
      log: function (html, o, cb, defaults) {
         var msg = {}
         if (defaults)
           for (var opt in defaults)
               msg[opt] = defaults[opt]

         if (typeof o == 'function') cb = o
         else if (o)
            for (var opt in o) msg[opt] = o[opt]

         msg.html = html
         if (cb) msg.cb = cb
         this.queue.push(msg)
         this._run()
         return this
      },
      spawn: function (defaults) {
         var self = this
         return function (html, o, cb) {
            self.log.call(self,html,o,cb,defaults)
            return self
         }
      },
      create: function (o) { return new Humane(o) }
   }
   return new Humane()
})

});
require.register("settings-store/index.js", function(exports, require, module){
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

});
require.register("throttle/index.js", function(exports, require, module){
var throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function() {
    previous = options.leading === false ? 0 : new Date;
    timeout = null;
    result = func.apply(context, args);
  };
  return function() {
    var now = new Date;
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

module.exports = throttle;

});
















require.alias("jb55-domready/index.js", "beats/deps/domready/index.js");
require.alias("jb55-domready/index.js", "domready/index.js");

require.alias("ded-qwery/qwery.js", "beats/deps/qwery/qwery.js");
require.alias("ded-qwery/qwery.js", "beats/deps/qwery/index.js");
require.alias("ded-qwery/qwery.js", "qwery/index.js");
require.alias("ded-qwery/qwery.js", "ded-qwery/index.js");
require.alias("fat-bean/bean.js", "beats/deps/bean/bean.js");
require.alias("fat-bean/bean.js", "beats/deps/bean/index.js");
require.alias("fat-bean/bean.js", "bean/index.js");
require.alias("fat-bean/bean.js", "fat-bean/index.js");
require.alias("itsjoesullivan-event/index.js", "beats/deps/event/index.js");
require.alias("itsjoesullivan-event/index.js", "event/index.js");

require.alias("component-inherit/index.js", "beats/deps/inherit/index.js");
require.alias("component-inherit/index.js", "inherit/index.js");

require.alias("component-classes/index.js", "beats/deps/classes/index.js");
require.alias("component-classes/index.js", "classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("component-truncate/index.js", "beats/deps/truncate/index.js");
require.alias("component-truncate/index.js", "truncate/index.js");

require.alias("remy-polyfills/classList.js", "beats/deps/polyfills/classList.js");
require.alias("remy-polyfills/dataset.js", "beats/deps/polyfills/dataset.js");
require.alias("remy-polyfills/device-motion-polyfill.js", "beats/deps/polyfills/device-motion-polyfill.js");
require.alias("remy-polyfills/EventSource.js", "beats/deps/polyfills/EventSource.js");
require.alias("remy-polyfills/index.js", "beats/deps/polyfills/index.js");
require.alias("remy-polyfills/input-target.js", "beats/deps/polyfills/input-target.js");
require.alias("remy-polyfills/offline-events.js", "beats/deps/polyfills/offline-events.js");
require.alias("remy-polyfills/range.js", "beats/deps/polyfills/range.js");
require.alias("remy-polyfills/sessionStorage.js", "beats/deps/polyfills/sessionStorage.js");
require.alias("remy-polyfills/Storage.js", "beats/deps/polyfills/Storage.js");
require.alias("remy-polyfills/index.js", "beats/deps/polyfills/index.js");
require.alias("remy-polyfills/index.js", "polyfills/index.js");
require.alias("remy-polyfills/index.js", "remy-polyfills/index.js");
require.alias("javascript-augment/lib/augment.js", "beats/deps/augment/lib/augment.js");
require.alias("javascript-augment/lib/augment.js", "beats/deps/augment/index.js");
require.alias("javascript-augment/lib/augment.js", "augment/index.js");
require.alias("javascript-augment/lib/augment.js", "javascript-augment/index.js");
require.alias("segmentio-extend/index.js", "beats/deps/extend/index.js");
require.alias("segmentio-extend/index.js", "extend/index.js");

require.alias("jofan-draggy/lib/draggy.js", "beats/deps/draggy/lib/draggy.js");
require.alias("jofan-draggy/lib/draggy.js", "beats/deps/draggy/index.js");
require.alias("jofan-draggy/lib/draggy.js", "draggy/index.js");
require.alias("DamonOehlman-stylar/index.js", "jofan-draggy/deps/stylar/index.js");
require.alias("DamonOehlman-stylar/index.js", "jofan-draggy/deps/stylar/index.js");
require.alias("DamonOehlman-stylar/index.js", "DamonOehlman-stylar/index.js");
require.alias("component-classes/index.js", "jofan-draggy/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("jofan-draggy/lib/draggy.js", "jofan-draggy/index.js");
require.alias("turbolinks/index.js", "beats/deps/turbolinks/index.js");
require.alias("turbolinks/index.js", "turbolinks/index.js");

require.alias("spin.js/index.js", "beats/deps/spin.js/index.js");
require.alias("spin.js/index.js", "spin.js/index.js");

require.alias("humane.js/index.js", "beats/deps/humane.js/index.js");
require.alias("humane.js/index.js", "humane.js/index.js");

require.alias("settings-store/index.js", "beats/deps/settings-store/index.js");
require.alias("settings-store/index.js", "beats/deps/settings-store/index.js");
require.alias("settings-store/index.js", "settings-store/index.js");
require.alias("settings-store/index.js", "settings-store/index.js");
require.alias("throttle/index.js", "beats/deps/throttle/index.js");
require.alias("throttle/index.js", "throttle/index.js");
