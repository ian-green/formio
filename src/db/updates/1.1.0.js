'use strict';

const async = require('async');
const crypto = require('crypto');

/**
 * Encrypt some text
 * @param   {String} secret
 * @param   {Object} mixed
 * @returns {Buffer}
 */
function encrypt(secret, mixed) {
  if (_.isUndefined(mixed)) {
    return undefined;
  }

  const cipher = crypto.createCipher('aes-256-cbc', secret);
  const decryptedJSON = JSON.stringify(mixed);

  return Buffer.concat([
    cipher.update(decryptedJSON),
    cipher.final()
  ]);
};

/**
 * Update 1.1.0
 *
 * @param db
 * @param config
 * @param tools
 * @param done
 */
module.exports = (db, config, tools, done) => {
  // MongoDB Find all oldApps where user has unencrypted settings.
  db.collection('applications').find({ settings: {$exists: true }}).forEach((application) => {
      // Encrypt each Application's settings at rest.
      db.collection('applications').update(
      { _id: application._id },
      {
        $unset: { settings: undefined },
        $set: {
          settings_encrypted: encrypt(config.mongoSecret, application.settings),
        }
      }
    )
  },
  done);
}
