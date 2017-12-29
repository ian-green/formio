'use strict';

const Exporter = require('../Exporter');
const JSONStream = require('JSONStream');

const JSONExporter = function(form, req, res) {
  Exporter.call(this, form, req, res);
  this.extension = 'json';
  this.contentType = 'application/json';
};

JSONExporter.prototype = Object.create(Exporter.prototype);
JSONExporter.prototype.constructor = JSONExporter;
JSONExporter.prototype.stream = function(stream) {
  return stream
    .pipe(JSONStream.stringify())
    .pipe(this.res);
};

module.exports = JSONExporter;
