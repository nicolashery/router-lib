var Matcher = require('../lib/Matcher');

describe('Matcher', function() {

  describe('fromPaths', function() {
    it('returns an array of matchers with same length as array of paths', function() {
      var paths = ['/items', '/item/:id'];

      var matchers = Matcher.fromPaths(paths);

      expect(matchers).to.have.length(paths.length);
    });
  });

  describe('fromPath', function() {
    it('returns matcher with expected properties from given path', function() {
      var path = '/item/:id';

      var matcher = Matcher.fromPath(path);

      expect(matcher.path).to.equal('/item/:id');
      expect(matcher.regexp).to.deep.equal(/^\/item\/([^\\/]+?)(?:\/(?=$))?$/i);
      expect(matcher.keys).to.have.length(1);
      expect(matcher.keys[0].name).to.equal('id');
    });
  });

  describe('matchWithRegexp', function() {
    it('returns correct matcher if uri matched', function() {
      var matcher = {
        path: '/item/:id',
        regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };

      var match = Matcher.matchWithRegexp([matcher], '/item/123');

      expect(match.path).to.equal(matcher.path);
    });

    it('returns null if no match', function() {
      var matcher = {
        path: '/item/:id',
        regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };

      var match = Matcher.matchWithRegexp([matcher], '/items');

      expect(match).to.equal(null);
    });
  });

  describe('matchWithPath', function() {
    it('returns correct matcher if path matched', function() {
      var matcher = {
        path: '/item/:id',
        regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };

      var match = Matcher.matchWithPath([matcher], '/item/:id');

      expect(match.path).to.equal(matcher.path);
    });

    it('returns null if no match', function() {
      var matcher = {
        path: '/item/:id',
        regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };

      var match = Matcher.matchWithPath([matcher], '/items');

      expect(match).to.equal(null);
    });
  });
});
