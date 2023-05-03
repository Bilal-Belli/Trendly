# mandatory [![Build Status](https://travis-ci.org/konexmedia/mandatory.svg?branch=master)](https://travis-ci.org/konexmedia/mandatory)

A tiny error-throwing module for checking types.

## Motivation

In a language like JavaScript where there is no compilation step, you have to be very consequent when it comes to make sure that certain parameter values are of a specific type or are available at all. If it does not, then it should be considered as a programmer error and must be thrown immediately.

Node.js ships with the awesome [assert](nodejs.org/api/assert.html) module which is very handy in this use case. Anyways, when you use it intensively you will discover that the handling of edge cases has to be done manually (like checking if a value is a _real_ object (JS does treat arrays and objects equally as `object`)). With `assert` you have to do something like

```javascript
    assert.equal('object' === typeof param && !util.isArray(param), true, '"param" should be a real object.');
```

Using _raw_ asserts will mess up your code quickly. This is where `mandatory` enters the stage:

```javascript
    mandatory(param).is('object');
```

It uses the `assert` module internally and wraps it into a minimalistic API. Like `assert`, it throws error objects which is cool, because passing wrong parameters is a programmer error which should _fail fast_.

## Installation

```bash
npm install --save mandatory
```

## Usage

```javascript
'use strict'

var mandatory = require('mandatory');

exports.doSomething = function doSomething (id, options, foo, callback) {
    mandatory(id).is('number');
    mandatory(options).is('object');
    mandatory(foo).is('array', '"foo" should be a real array');
    mandatory(callback).is('function');
    
    ...
};
```

### API

#### mandatory(value).is(expectedType [, message]);

 * `expectedType` string, number, object, array, function
 * `message` (optional) A custom error message. Otherwise _mandatory_ will respond with a default error message, like 'Expected "object", but received "array"'

## Performance

In a typed language with a compile phase you benefit from the execution of those checks in this phase. By checking it on every function execution it is crucial that those checks have to be fast. The `gulpfile` comes with a suite which tests `mandatory's` performance. You can initiate it by executing `gulp benchmark`. This is one result:

```bash
index.performance x 149,332 ops/sec ±6.96% (79 runs sampled)
```

This shows that the `assert` module is pretty fast.

## License

The MIT License (MIT) Copyright (c) 2014 konexmedia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.