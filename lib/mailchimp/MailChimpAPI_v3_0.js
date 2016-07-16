'use strict';
/**
 * Mailchimps API V3 integration
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTTPS = require('https'),
    Q = require('q'),
    STRINGDECODER = require('string_decoder').StringDecoder,
    DECODER = new STRINGDECODER('utf8');

/**
 * The Mailchimp v3 API integration for nodejs
 * Detailed information can be found in the readme.md file
 *
 * @author      Bob van Luijt
 * @version     0.1
 */

var MailChimpV3 = function () {

  /**
   * Constructor function
   *
   * @param {string} 	i Object with key and optional host information
   */

  function MailChimpV3(i) {
    _classCallCheck(this, MailChimpV3);

    /**
     * Report error when key is not set, otherwise set key to this.key
     */
    if (typeof i.key === 'undefined') {
      console.warn('WARN: Key is undefined, add your API KEY');
    } else {
      this.key = i.key;
    }
    /**
     * Check if custom server location is set, if not, set to 12
     */
    if (typeof i.location === 'undefined') {
      this.location = 'us12';
    } else {
      this.location = i.location;
    }
    /**
     * Check if debug is set, if not, set to false
     */
    if (typeof i.debug === 'undefined') {
      this.debug = false;
    } else {
      this.debug = true;
    }
  }

  /**
   * Connect()
   * Makes an https connection to the Mailchimp server
   *
   * @param {string}	endpoint Based on http://goo.gl/hAZnhM
   * @param {string}	method Method set for request type
   * @return {Object}	returns the promises then() and error()
   */


  _createClass(MailChimpV3, [{
    key: 'connect',
    value: function connect(endpoint, method, data) {
      var _this = this;

      var decodedData = JSON.stringify(data);

      /**
       * Using Q for promises
       */
      var deferred = Q.defer();
      /**
       * Set request options
       */
      var options = {
        headers: {
          'Content-Type': 'application/json'
        },
        auth: 'anystring:' + this.key,
        hostname: this.location + '.api.mailchimp.com',
        port: 443,
        path: '/3.0' + endpoint,
        method: method
      };

      /**
       * If data is set, add to POST
       */
      if (typeof data !== 'undefined') {
        options['headers'] = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': decodedData.length
        };
      } else {
        if (this.debug === true) {
          console.log('** No data is set (sometimes this is ok, for example with a GET request)');
        }
      }

      /**
       * Do the actual request, console.logs if debug === true
       */
      var resRaw = [];
      var req = HTTPS.request(options, function (res) {

        if (_this.debug === true) {
          console.log('** statusCode: ', res.statusCode);
          console.log('** headers: ', res.headers);
          console.log('** response: ' + res);
        }
        res.on('data', function (d) {
          resRaw.push(DECODER.write(d));
        });

        res.on('end', function () {
          /**
           * Sending the response as a deffer
           */
          var jsonRes = JSON.parse(resRaw.join(''));
          deferred.resolve(jsonRes);
        });
      });

      /**
       * If data is set, add to POST or PATCH
       */
      if (method === 'POST' || method === 'PATCH') {
        req.write(decodedData);
      }

      /**
       * Send error promise if error occured
       */
      req.on('error', function (e) {
        if (_this.debug === true) {
          console.error('ERROR: ' + e);
        }
        deferred.reject(e);
      });

      req.end();

      /**
       * Return the promise
       */
      return deferred.promise;
    }

    /**
     * Get()
     * Used for all GET related calls
     *
     * @param {endpoint}	endpoint Based on http://goo.gl/hAZnhM
     * @return {Object}		returns the promises then() and error()
     */

  }, {
    key: 'get',
    value: function get(endpoint, data) {
      /**
       * Using Q for promises
       */
      var deferred = Q.defer();
      /**
       * Do the request and prepare promise
       */
      this.connect(endpoint, 'GET', data).then(function (d) {
        deferred.resolve(d);
      });
      //.error(function(e){
      //	console.error('OOPS ' + e);
      //});
      return deferred.promise;
    }
  }, {
    key: 'post',
    value: function post(endpoint, data) {
      /**
       * Using Q for promises
       */
      var deferred = Q.defer();

      /**
       * Do the request and prepare promise
       */
      this.connect(endpoint, 'POST', data).then(function (d) {
        deferred.resolve(d);
      });
      //.error(function(e){
      //	console.error('OOPS ' + e);
      //});
      return deferred.promise;
    }
  }, {
    key: 'patch',
    value: function patch(endpoint, data) {
      /**
       * Using Q for promises
       */
      var deferred = Q.defer();

      /**
       * Do the request and prepare promise
       */
      this.connect(endpoint, 'PATCH', data).then(function (d) {
        deferred.resolve(d);
      });
      //.error(function(e){
      //	console.error('OOPS ' + e);
      //});
      return deferred.promise;
    }
  }, {
    key: 'put',
    value: function put(endpoint, data) {
      /**
       * Using Q for promises
       */
      var deferred = Q.defer();
      /**
       * Do the request and prepare promise
       */
      this.connect(endpoint, 'PUT', data).then(function (d) {
        deferred.resolve(d);
      });
      //.error(function(e){
      //	console.error('OOPS ' + e);
      //});
      return deferred.promise;
    }
  }, {
    key: 'delete',
    value: function _delete(endpoint, data) {
      /**
       * Using Q for promises
       */
      var deferred = Q.defer();
      /**
       * Do the request and prepare promise
       */
      this.connect(endpoint, 'DELETE', data).then(function (d) {
        deferred.resolve(d);
      });
      //.error(function(e){
      //	console.error('OOPS ' + e);
      //});
      return deferred.promise;
    }
  }]);

  return MailChimpV3;
}();

/**
 * Return the module
 */


module.exports = MailChimpV3;