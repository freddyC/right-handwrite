'use strict';

const brain = require('brain.js');

let trainingData;

module.exports = class HandwritingNetwork extends brain.NeuralNetwork {
  constructor(options) {
    super(options);
    if (!trainingData) {
      trainingData = require ('./trained-network.json');
    }
    this.fromJSON(trainingData);
  }
};