'use strict';

const crypto = require('crypto');
const util = require('../util/util');
const _ = require('lodash');

module.exports = (db, schema) => {
  return {
    /**
     * Include the formio utils.
     */
    util: util,

    /**
     * Update the version store in the schema lock, using the provided schema and the mongo native driver.
     *
     * @param version
     * @returns {Function}
     */
    updateLockVersion(version, callback) {
      schema.findOneAndUpdate(
        {key: 'formio'},
        {$set: {version: version}},
        (err, document) => {
          if (err) {
            throw err;
          }

          util.log(` > Upgrading MongoDB Schema lock to v${version}`);
          callback();
        }
      );
    },
    /**
     * Encrypt some text
     * @param   {String} secret
     * @param   {Object} mixed
     * @returns {Buffer}
     */
    encrypt(secret, mixed) {
      if (_.isUndefined(mixed)) {
        return undefined;
      }

      const cipher = crypto.createCipher('aes-256-cbc', secret);
      const decryptedJSON = JSON.stringify(mixed);

      return Buffer.concat([
        cipher.update(decryptedJSON),
        cipher.final()
      ]);
    },
    decrypt(secret, cipherbuffer) {
      if (_.isUndefined(cipherbuffer)) {
        return undefined;
      }

      const decipher = crypto.createDecipher('aes-256-cbc', secret);
      const decryptedJSON = Buffer.concat([
        decipher.update(cipherbuffer), // Buffer contains encrypted utf8
        decipher.final()
      ]);

      return JSON.parse(decryptedJSON);  // This can throw a exception
    }
  };
};
