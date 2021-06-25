import _ from 'lodash';
var BlockUniverse = require('./js/experimentEnvironment.js');

blockUniverse = new BlockUniverse();

reset = function(game) {
  // Need to remove old screens
  if(_.has(blockUniverse, 'p5env') || //won't need for display
     _.has(blockUniverse, 'p5stim')) {
    blockUniverse.removeEnv();
    blockUniverse.removeStimWindow();
  }

  blockUniverse.setupEnvs([]);
  console.log('trying');

}

reset([]);

function component() {
  
    const element = document.createElement('div');
  
    element.innerHTML = _.join(['Display', 'towers'], ' ');
  
    return element;
  }
  
document.body.appendChild(component());
  