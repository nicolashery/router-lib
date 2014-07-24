var Params = require('../lib/Params');

describe('Params', function() {

  describe('injectIntoPath', function() {
    it('replaces path keys with param values', function() {
      var path = '/user/:userId/task/:taskId';
      var params = {
        userId: '123',
        taskId: '456'
      };

        var pattern = Params.injectIntoPath(path, params);

      expect(pattern).to.equal('/user/123/task/456');
    });
  });

  describe('fromMatchedPattern', function() {
    it('extracts a param object from a pattern with a matcher', function() {
      var pattern = '/item/123';
      var matcher = {
        path: '/item/:id',
        regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };

      var params = Params.fromMatchedPattern(matcher, pattern);

      expect(params).to.deep.equal({id: '123'});
    });

    it('returns null if no match', function() {
      var pattern = '/items';
      var matcher = {
        path: '/item/:id',
        regexp: /^\/item\/([^\\/]+?)(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };

      var params = Params.fromMatchedPattern(matcher, pattern);

      expect(params).to.equal(null);
    });

    it('returns null if no params in path', function() {
      var pattern = '/items';
      var matcher = {
        path: '/items',
        regexp: /^\/items(?:\/(?=$))?$/i,
        keys: []
      };

      var params = Params.fromMatchedPattern(matcher, pattern);

      expect(params).to.equal(null);
    });
  });
});
