'use strict';

const partialFileName = 'partial-trained.json';
const trainedNetworkFileName = 'trained-network.json';

var fs      = require ('fs');
var mnist   = require ('mnist');
var brain  = require ('brain.js');


var net = null;

if (fs.existsSync ('./' + partialFileName)) {
  console.log('picking up old training');
  var partial = require ('./'+partialFileName);
  var HWN = require ('./index');
  net = new HWN (partial);
} else {
  console.log('creating new network')
  net = new brain.NeuralNetwork({
    hiddenLayers: [ 80, 50, 25 ]
  });
}

var trainingData = [];

for (var i = 0; i < 10; ++i) {
  let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  result[i] = 1;
  let numbs = mnist[i].range(0,500);
  numbs.forEach (numb => {
    trainingData.push({
      input: numb,
      output: result
    })
  })
}

var time = new Date();
console.log ('start training network at ' + time.toString ());
net.train(trainingData, {
  log: false,
  errorThresh: 0.00011986,
  logPeriod: 2,
  callback: function (status) {
    console.log('saving training on iteration: ' + status.iterations + ' with error: ' + (Math.floor(status.error * 1000000) / 10000) + '%');
    fs.writeFileSync(partialFileName, JSON.stringify(net.toJSON()));
  },
  callbackPeriod: 5
});

time = new Date();
console.log ('end training network at ' + time.toString ());

fs.writeFileSync(trainedNetworkFileName, JSON.stringify(net.toJSON()));
fs.unlinkSync(partialFileName);

console.log ('done and out');
