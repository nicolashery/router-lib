var Route = require('../lib/Route');

describe('Route', function() {

  describe('toUri', function() {
    it('returns correct uri string from route object', function() {
      var route = {
        path: '/list/:id/items',
        params: {id: '123'},
        query: {sort: 'ascending'}
      };

      var uri = Route.toUri(route);

      expect(uri).to.equal('/list/123/items?sort=ascending');
    });
  });

  describe('fromMatchedUri', function() {
    it('builds a route object from a uri with a matcher', function() {
      var matcher = {
        path: '/list/:id/items',
        regexp: /^\/list\/([^\\/]+?)\/items(?:\/(?=$))?$/i,
        keys: [{name: 'id'}]
      };
      var uri = '/list/123/items?sort=ascending';

      var route = Route.fromMatchedUri(matcher, uri);

      expect(route).to.deep.equal({
        path: '/list/:id/items',
        params: {id: '123'},
        query: {sort: 'ascending'}
      });
    });
  });
});
