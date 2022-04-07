import _ from 'lodash';
var BlockUniverse = require('./js/blockUniverse.js');
// var config = require('./display_config.js');

window.blockUniverse = new BlockUniverse(config);

window.setupHighlighting = function(trialObj, showStimulus, showBuilding, callback) {

  window.blockUniverse.setupEnvs(trialObj, showStimulus, showBuilding, callback);

};