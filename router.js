var browser = require('./lib/browser');
var Route = require('./lib/Route');
var Matcher = require('./lib/Matcher');
var Query = require('./lib/Query');

var router = {
  _matcher: [],
  _onChangeHandler: function() {},

  setMatchedPaths: function(paths) {
    this._matchers = Matcher.fromPaths(paths);
    return this;
  },

  setOnChangeHandler: function(handler) {
    this._onChangeHandler = handler;
    return this;
  },

  start: function() {
    this._addEventListeners();
    this._onUriChange();
  },

  isRouteMatched: function(route) {
    if (!route) {
      return false;
    }
    var path = route.path;
    return Boolean(Matcher.matchWithPath(this._matchers, path));
  },

  _skipNextOnChangeHandler: false,

  updateBrowserUri: function(route, options) {
    options = options || {};
    var currentUri = browser.getCurrentUri();
    var newUri = this.uriFromRoute(route);

    if (newUri === currentUri) {
      // Will not fire browser's hash change handler
      // and there is no need to update anyway
      return;
    }

    // Will fire browser's hash change handler,
    // but we just want to do a "silent" update
    this._skipNextOnChangeHandler = true;

    if (options.replace) {
      browser.replaceUri(newUri);
    }
    else {
      browser.setUri(newUri);
    }
  },

  uriFromRoute: function(route) {
    return Route.toUri(route);
  },

  _addEventListeners: function() {
    browser.on('hashchange', this._onUriChange, this);
  },

  _onUriChange: function() {
    if (this._skipNextOnChangeHandler) {
      this._skipNextOnChangeHandler = false;
      return;
    }

    var uri = browser.getCurrentUri();

    if (!(uri && uri.length)) {
      uri = '/';
      browser.replaceUri(uri);
      return;
    }

    var route = null;
    var pattern = Query.uriWithoutQueryString(uri);
    var matcher = Matcher.matchWithRegexp(this._matchers, pattern);
    if (matcher) {
      route = Route.fromMatchedUri(matcher, uri);
    }

    this._onChangeHandler(uri, route);
  }
};

module.exports = router;
