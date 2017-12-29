'use strict';

var _ = require('lodash');
var debug = require('debug')('formio:middleware:filterResourcejsResponse');

/**
 * Middleware function to filter the response from resourcejs.
 *
 * @param router
 * @param {array} settings
 *
 * @returns {Function}
 */
module.exports = function(router) {
  return function(settings) {
    return function(req, res, next) {
      if (!settings || settings === [] || !_.isArray(settings)) {
        return next();
      }
      if (!res || !res.resource || !res.resource.item) {
        return next();
      }

      debug(settings);
      // Merge all results into an array, to handle the cases with multiple results.
      var multi = false;
      var list = [].concat(res.resource.item);
      if (_.isArray(res.resource.item)) {
        multi = true;
      }

      // Iterate each provided filter.
      for (var a = 0; a < settings.length; a++) {
        // Iterate each result.
        for (var b = 0; b < list.length; b++) {
          // Change the response object from a mongoose model to a js object.
          if (list[b].constructor.name === 'model') {
            list[b] = list[b].toObject();
          }
          // Remove the key if found.
          if (list[b].hasOwnProperty(settings[a])) {
            debug('Removing: ' + settings[a]);
            list[b] = _.omit(list[b], settings[a]);
          }
        }
      }

      // If there were multiple results, update the response list, otherwise return only the original item.
      if (multi) {
        res.resource.item = list;
        return next();
      }
      else {
        res.resource.item = list[0];
        return next();
      }
    };
  };
};
