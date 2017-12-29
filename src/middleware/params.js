'use strict';

const util = require('../util/util');
const _ = require('lodash');
const debug = require('debug')('formio:request');

module.exports = function(router) {
  const hook = require('../util/hook')(router.formio);
  return function paramsHandler(req, res, next) {
    // Split the request url into its corresponding parameters.
    const params = _.assign(util.getUrlParams(req.url), util.getUrlParams(req.baseUrl));

    // Get the formId from the request url.
    const formId = params.hasOwnProperty('form') && !_.isUndefined(params.form)
      ? params.form
      : null;

    // Get the formId from the request url.
    let subId = params.hasOwnProperty('submission') && !_.isUndefined(params.form)
      ? params.submission
      : null;

    // Get the roleId from the request url.
    const roleId = params.hasOwnProperty('role') && _.isUndefined(params.role)
      ? params.role
      : null;

    // FA-993 - Update the request to check submission index in the case of submission exports.
    if (_.isNull(subId) && !_.isNull(formId) && params.hasOwnProperty('export')) {
      subId = '';
    }

    // Attach the known id's to the request for other middleware.
    req.formId = formId;
    req.subId = subId;
    req.roleId = roleId;
    hook.alter('requestParams', req, params);
    debug(params);

    next();
  };
};
