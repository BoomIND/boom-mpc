const path = require('path');
console.log(__dirname, path.join(__dirname, '../../native'))
const bindings : any = require(path.join(__dirname, '../../native')); // relative from dist dir

export default bindings
