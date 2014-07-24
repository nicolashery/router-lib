var helpers = require('../lib/helpers');

describe('helpers', function() {

  describe('slice', function() {
    it('returns part of an array', function() {
      var list = [1, 2, 3];
      var subList = helpers.slice(list, 1, 2);
      expect(subList).to.deep.equal([2]);
    });
  });

  describe('bind', function() {
    it('binds a function to a context', function() {
      var ctx = {
        sum: 0,
        add: function(quantity) {
          this.sum = this.sum + quantity;
        }
      };
      var add = helpers.bind(ctx.add, ctx);
      add(2);
      expect(ctx.sum).to.equal(2);
    });
  });

  describe('map', function() {
    it('maps a function over a collection', function() {
      var squares = helpers.map(function(v) {
        return v * v;
      }, [2, 3]);
      expect(squares).to.deep.equal([4, 9]);
    });
  });

  describe('reduce', function() {
    it('uses a function to reduce a collection', function() {
      var sum = helpers.reduce(function(acc, v) {
        return acc + v;
      }, 0, [1, 2]);
      expect(sum).to.equal(3);
    });
  });

  describe('each', function() {
    it('iterates over a collection', function() {
      var sum = 0;
      helpers.each(function(v) {
        sum = sum + v;
      }, [1, 2]);
      expect(sum).to.equal(3);
    });
  });

  describe('properties', function() {
    it('returns an object\'s own properties as an array', function() {
      var obj = {a: 1, b: 2};
      var keys = helpers.properties(obj);
      expect(keys).to.deep.equal(['a', 'b']);
    });
  });
});
