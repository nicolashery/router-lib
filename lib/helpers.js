var fn = require('fn.js');

var helpers = {};

helpers.slice = function(array) {
  var args = Array.prototype.slice.call(arguments, 1);
  return Array.prototype.slice.apply(array, args);
};

helpers.bind = function(func, context) {
  return function() {
    func.apply(context, Array.prototype.slice.call(arguments));
  };
};

helpers.map = fn.map;

helpers.reduce = fn.reduce;

helpers.each = fn.each;

helpers.properties = fn.properties;

module.exports = helpers;
