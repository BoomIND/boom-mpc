"use strict";
var path = require('path');
console.log(__dirname, path.join(__dirname, '../../native'));
var bindings = require(path.join(__dirname, '../../native')); // relative from dist dir
module.exports = bindings;
