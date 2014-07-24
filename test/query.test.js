var Query = require('../lib/Query');

describe('Query', function() {

  describe('stringify', function() {
    it('builds correct query string from query object', function() {
      var query = {
        details: 'true',
        user: {name: 'bob'}
      };

      var queryString = Query.stringify(query);

      expect(queryString).to.equal('details=true&user[name]=bob');
    });
  });

  describe('parse', function() {
    it('parses query string to correct query object', function() {
      var queryString = 'details=true&user[name]=bob';

      var query = Query.parse(queryString);

      expect(query).to.deep.equal({
        details: 'true',
        user: {name: 'bob'}
      });
    });
  });

  describe('uriWithoutQueryString', function() {
    it('removes query string from uri and returns pattern', function() {
      var uri = '/user/123/tasks?sort=ascending';

      var pattern = Query.uriWithoutQueryString(uri);

      expect(pattern).to.equal('/user/123/tasks');
    });
  });

  describe('fromUri', function() {
    it('extracts the query object from a uri', function() {
      var uri = '/user/123/tasks?sort=ascending';

      var query = Query.fromUri(uri);

      expect(query).to.deep.equal({sort: 'ascending'});
    });
  });
});
