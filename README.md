# Router Lib

[![Build Status](https://travis-ci.org/nicolashery/router-lib.svg?branch=master)](https://travis-ci.org/nicolashery/router-lib)

A set of client-side utility functions to Build-Your-Own-Router.

(Includes a simple example router that you can use as-is, or as inspiration for your own creation.)

## Installation

```bash
$ npm install router-lib
```

## router.js

An example router built with the `lib/` components. Can be used as-is, or serve as inspiration to build your own.

```javascript
var router = require('router-lib').router;
```

Set the paths you want the router to match URIs with:

```javascript
router.setMatchedPaths([
  '/items',
  '/item/:id',
  '/404'
]);
```

Set the handler you want to be called when the browser's URI changes with:

```javascript
var currentRoute;
router.setOnChangeHandler(function(uri, route) {
  if (!route) {
    // URI was not matched
    route = {path: '/404'};
  }
  currentRoute = route;
});
```

You can also update the browser URI programmatically (will not fire the on URI change handler). Example:

```javascript
function navigateTo(route) {
  if (!router.isMatched(route)) {
    return navigateTo({path: '/404'});
  }
  currentRoute = route;
  router.updateBrowserUri(route);
}
```

Start the router to listen to browser URI changes:

```javascript
router.start();
```

## lib/Route.js

```javascript
var Route = require('router-lib').Route;
```

A `route` object looks like:

```javascript
var route = {
  path: '/list/:id/items',
  params: {id: '123'},
  query: {sort: 'ascending'}
};
```

The above route will produce the `uri`:

```javascript
var uri = Route.toUri(route);
//-> '/list/123/items?sort=ascending'
```

And vice-versa, with the proper `matcher` (see below), the above `uri` can be parsed
and produce the `route` object:

```javascript
var route = Route.fromMatchedUri(matcher, '/list/123/items?sort=ascending');
//-> returns the same `route` object defined earlier
```

## lib/Matcher.js

```javascript
var Matcher = require('router-lib').Matcher;
```

The following `path`:

```javascript
var path = '/item/:id';
```

Will produce the `matcher` object:

```javascript
var matcher = Matcher.fromPath(path);
//->
{
  path: '/item/:id',
  regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
  keys: [{name: 'id'}]
}
```

Which can be used to match a `pattern` (i.e. a `uri` without the query string):

```javascript
var match = Matcher.matchWithRegexp([matcher], '/item/123');
//-> returns the `matcher` object
```

Or to match the `path` itself:

```javascript
var match = Matcher.matchWithPath([matcher], '/item/:id');
//-> returns the `matcher` object
```

No match returns `null`:

```javascript
var match = Matcher.matchWithRegexp([matcher], '/foo');
//-> null
```

You can also construct an array of matchers from an array of paths:

```javascript
var matchers = Matcher.fromPaths([
  '/items',
  '/item/:id'
]);
```

## lib/Params.js

```javascript
var Params = require('router-lib').Params;
```

The following `params` object:

```javascript
var params = {
  userId: '123',
  taskId: '456'
};
```

Gets injected into a `path` to produce a `pattern`:

```javascript
var pattern = Params.injectIntoPath('/user/:userId/task/:taskId', params);
//-> '/user/123/task/456'
```

And vice-versa, with the proper `matcher` object, the `params` will get extracted from the `pattern`:

```javascript
var params = Params.fromMatchedPattern(matcher, '/user/123/task/456');
//->
{
  userId: '123',
  taskId: '456'
}
```

## lib/Query.js

```javascript
var Query = require('router-lib').Query;
```

The following `queryString`:

```javascript
var queryString = 'details=true&user[name]=bob';
```

Gets parsed to produce the `query` object:

```javascript
var query = Query.parse(queryString);
//->
{
  details: 'true',
  user: {name: 'bob'}
}
```

And vice-versa, the above `query` object can be stringified to produce the `queryString`:

```javascript
var queryString = Query.stringify(query);
//-> 'details=true&user[name]=bob'
```

You can separate a `uri` into a `pattern` and a `query` object:

```javascript
var uri = '/user/123/tasks?sort=ascending';

var pattern = Query.uriWithoutQueryString(uri);
//-> '/user/123/tasks'

var query = Query.fromUri(uri);
//-> {sort: 'ascending'}
```

## lib/browser.js

A set of functions to interact with the browser environment.

```javascript
var browser = require('router-lib').browser;
```

Listen to the hash change event:

```javascript
browser.on('hashchange', this._onUriChange, this);
```

Change to browser hash to a certain `uri`:

```javascript
browser.setUri('/dashboard');
// browser URL will be 'http://localhost:8080/#/dashboard'
```

(Use `browser.replaceUri()` if you don't want to add an entry to the browser history.)

Get current `uri` from browser hash:

```javascript
// browser URL is 'http://localhost:8080/#/items?sort=ascending'
var uri = browser.getCurrentUri();
//-> '/items?sort=ascending'
```

## Test

Run unit tests:

```bash
$ npm test
```

Run unit tests and watch for changes:

```bash
$ npm run test-watch
```

Run [ESLint](http://eslint.org/):

```
$ npm run eslint
```

## License

MIT
