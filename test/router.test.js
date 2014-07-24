describe('router', function() {

  describe('setMatchedPaths', function() {
    it('creates and stores an array of matchers', function() {
      var router = proxyquire('../router', {});
      var paths = [
        '/items',
        '/item/:id',
        '/404'
      ];

      router.setMatchedPaths(paths);
      var matchers = router._matchers;

      expect(matchers).to.have.length(paths.length);
      expect(matchers[0]).to.have.keys(['path', 'regexp', 'keys']);
    });
  });

  describe('uri change handler', function() {
    var router, browser;

    beforeEach(function() {
      browser = {
        getCurrentUri: sinon.spy(),
        replaceUri: sinon.spy()
      };
      router = proxyquire('../router', {
        './lib/browser': browser
      });
      router.setMatchedPaths(['/item/:id']);
    });

    function uriChange(uri) {
      browser.getCurrentUri = sinon.stub().returns(uri);
      router._onUriChange();
    }

    it('calls handler with correct uri and route', function() {
      var handler = sinon.spy();
      router.setOnChangeHandler(handler);

      uriChange('/item/123');

      expect(handler).to.have.been.calledWith(
        '/item/123',
        sinon.match({
          path: '/item/:id',
          params: {id: '123'}
        })
      );
    });

    it('replaces browser uri with root if no uri present', function() {
      var handler = sinon.spy();
      router.setOnChangeHandler(handler);

      uriChange('');

      expect(browser.replaceUri).to.have.been.calledWith('/');
      expect(handler).to.not.have.been.called;
    });

    it('calls handler with uri and null if no matched route', function() {
      var handler = sinon.spy();
      router.setOnChangeHandler(handler);

      uriChange('/foo');

      expect(handler).to.have.been.calledWith('/foo', null);
    });
  });

  describe('updateBrowserUri', function() {
    var router, browser;

    beforeEach(function() {
      browser = {
        getCurrentUri: sinon.spy(),
        replaceUri: sinon.spy(),
        setUri: sinon.spy()
      };
      router = proxyquire('../router', {
        './lib/browser': browser
      });
    });

    it('updates browser with correct uri from route object', function() {
      var route = {
        path: '/item/:id',
        params: {id: '123'}
      };

      router.updateBrowserUri(route);

      expect(browser.setUri).to.have.been.calledWith('/item/123');
    });

    it('can replace uri without adding entry in browser history', function() {
      var route = {
        path: '/item/:id',
        params: {id: '123'}
      };

      router.updateBrowserUri(route, {replace: true});

      expect(browser.replaceUri).to.have.been.calledWith('/item/123');
    });

    it('does not trigger uri change handler', function() {
      var handler = sinon.spy();
      router.setOnChangeHandler(handler);
      var route = {
        path: '/item/:id',
        params: {id: '123'}
      };

      router.updateBrowserUri(route);

      expect(handler).to.not.have.been.called;
    });

    it('does not do anything if new uri is same as current uri', function() {
      browser.getCurrentUri = sinon.stub().returns('/item/123');
      var route = {
        path: '/item/:id',
        params: {id: '123'}
      };

      router.updateBrowserUri(route);

      expect(browser.setUri).to.not.have.been.called;
      expect(browser.replaceUri).to.not.have.been.called;
    });
  });

  describe('isRouteMatched', function() {
    var router;

    beforeEach(function() {
      router = proxyquire('../router', {});
      router.setMatchedPaths(['/item/:id']);
    });

    it('returns true if route is matched', function() {
      var match = router.isRouteMatched({
        path: '/item/:id',
        params: {id: '123'}
      });

      expect(match).to.be.true;
    });

    it('returns false if route is not matched', function() {
      var match = router.isRouteMatched({
        path: '/foo'
      });

      expect(match).to.be.false;
    });

    it('returns false if no route given', function() {
      var match = router.isRouteMatched(null);

      expect(match).to.be.false;
    });
  });

  describe('uriFromRoute', function() {
    var Route = {
      toUri: sinon.spy()
    };
    var router = proxyquire('../router', {
      './lib/Route': Route
    });

    it('calls Route.toUri', function() {
      var route = {path: '/items'};
      router.uriFromRoute(route);

      expect(Route.toUri).to.have.been.calledWith(sinon.match(route));
    });
  });
});
