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
});
