'use strict';

const _ = require('lodash');

module.exports = (formio) => ({
  settings(req, cb) {
    const settings = (formio.config && formio.config.settings) || {};
    if (formio.hooks && formio.hooks.settings) {
      return formio.hooks.settings(settings, req, cb);
    }

    // Load the settings directly.
    cb(null, settings);
  },
  invoke() {
    const name = arguments[0];
    if (
      formio.hooks &&
      formio.hooks.on &&
      formio.hooks.on[name]
    ) {
      const retVal = formio.hooks.on[name].apply(formio.hooks.on, _.slice(arguments, 1));
      return !_.isUndefined(retVal) ? !!retVal : true;
    }
    return false;
  },
  alter() {
    const debug = require('debug')('formio:hook:alter');
    const name = arguments[0];
    const fn = _.isFunction(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : null;

    debug(name);
    if (
      formio.hooks &&
      formio.hooks.alter &&
      formio.hooks.alter[name]
    ) {
      debug('Hook found');
      return formio.hooks.alter[name].apply(formio.hooks.alter, _.slice(arguments, 1));
    }
    else {
      // If this is an async hook instead of a sync.
      if (fn) {
        debug('No hook found, w/ async');
        return fn(null, arguments[1]);
      }
      else {
        debug('No hook found, w/ return');
        return arguments[1];
      }
    }
  }
});
