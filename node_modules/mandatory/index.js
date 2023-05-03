/*
 * mandatory
 *
 * Copyright(c) 2014 André König <andre.koenig@konexmedia.com>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@konexmedia.com>
 *
 */

'use strict';

var assert = require('assert');
var util = require('util');

module.exports = function (candidate) {
    var type = typeof candidate;

    type = ('object' === type && util.isArray(candidate)) ? 'array' : type;

    return {
        is: function is (expected, message) {
            expected = expected.toLowerCase();
            message = message || 'Expected "' + expected + '", but received "' + type + '".';

            switch (expected) {
                case 'object':
                    assert.equal(type === 'object' && !util.isArray(candidate), true, message);
                    break;
                
                case 'array':
                    assert.equal(util.isArray(candidate), true, message);
                    break;
                
                default:
                    assert.equal(type, expected, message);
            }
        }
    };
};