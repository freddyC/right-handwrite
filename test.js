'use strict';

var fs      = require ('fs');
var mnist   = require ('mnist');
var brain  = require ('brain.js');
var HWN = require ('./index');
var net = new HWN ();

var testData = [];

for (var i = 0; i < 10; ++i) {
  let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  result[i] = 1;
  let numbs = mnist[i].range(501,600);
  numbs.forEach (numb => {
    testData.push({
      input: numb,
      output: result
    })
  })
}

var error = 0;
var count = 0;

testData.forEach (data => {
  count++;
  var res = net.run(data.input);
  var resI = getMax(res);
  var index = getMax (data.output)
  var percent =  Math.floor(res[resI] * 10000) / 100;
  if (resI !== index) error++;
  console.log('Expected [' + index + '] Actual [' + resI + '] confidence [' + percent + '%]');
});

console.log ('Total Tests = ' + count);
console.log ('Total Errors = ' + error);
console.log ('Error Percentage = ' + (Math.floor(error/count * 10000) / 100) + '%');

function getMax (arr) {
  return (arr.reduce ((max, val, index) => {
    if (max.val < val) {
      max.val = val;
      max.i = index;
    }
    return max;
  }, {val: -1, i: -1})).i;
}