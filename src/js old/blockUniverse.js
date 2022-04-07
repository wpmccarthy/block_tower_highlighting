// Experiment frame, with Matter canvas and surrounding buttons
// var config = require('./display_config.js');
var Matter = require('./matter.js');
var p5 = require('./p5.js');
var Boundary = require('./boundary.js');
var BlockKind = require('./blockKind.js');
var Block = require('./block.js');
var HighlightGrid = require("./highlightGrid.js");
var display = require('./displayStimuli.js');
var imagePath = '../img/';
var gridDisplay = require("./gridDisplay.js")["gridDisplay"];

class BlockUniverse {

  constructor() {
    this.scoring = false;

    // Global Variables for Matter js and custom Matter js wrappers
    this.engine = undefined;
    this.blocks = [];
    this.propertyList = [];

    // Block placement variables
    this.isPlacingObject = false;
    this.rotated = false;
    this.selectedBlockKind = null;
    this.disabledBlockPlacement = false;
    this.snapBodiesPostPlacement = true;
    this.postSnap = false;

    // Store world
    this.discreteWorld = new Array(config.discreteEnvWidth);
    this.discreteWorldPrevious = new Array();

    // Task variables
    this.trialStart = Date.now()
    this.timeLastPlaced = Date.now();
    this.timeBlockSelected = Date.now();

    this.blockDims = config.blockDims;
    this.blockNames = config.blockNames;

    // // Metavariables
    // this.dbname = 'block_construction';
    // this.colname = 'silhouette';

    this.sendingBlocks = [];

    // Scaling values
    display.grid.setup(); // initialize grid

    // this.blockSender = undefined;

    this.blockKinds = this.setupBlockKinds();

    this.revealTarget = false;

    this.endCondition = null;

    this.trialObj = {};

  }

  setupEnvs(trialObj, showStim, showBuild) {
    var localThis = this;
    this.trialObj = trialObj;

    this.targetBlocks = display.translateTower(this.trialObj.stimulus, this.trialObj.offset); 

    this.env = new p5((env) => {
      localThis.setupHighlighting(env);
    }, 'highlighting-canvas');

  };

  setupBlockKinds() {
    // Create list of viable block kinds
    let blockKinds = {};
    var c = 0;
    this.blockDims.forEach((dims, i) => {
      blockKinds[String(dims)] = new BlockKind(this.engine, dims[0], dims[1], config.buildColors[c], this.blockNames[i], config.internalStrokeColors[c]);
      c++;
    });
    return blockKinds
  }

  setupBoundaries() {
    this.ground = new Boundary(
      config.envCanvasWidth / 2,
      config.floorY,
      config.envCanvasWidth * 1.5,
      config.floorHeight
    );
    this.leftSide = new Boundary(
      -30, config.envCanvasHeight / 2, 60, config.envCanvasHeight
    );
    this.rightSide = new Boundary(
      config.envCanvasWidth + 30, config.envCanvasHeight / 2, 60, config.envCanvasHeight
    );
  }

  setupHighlighting(env) {

    // reset discrete world representation
    for (let i = 0; i < this.discreteWorld.length; i++) {
      this.discreteWorld[i] = new Array(config.discreteEnvHeight).fill(true); // true represents free
    }

    // Processing JS Function, defines initial environment.
    env.setup = function () {
      // creates a P5 canvas (which is a wrapper for an HTML canvas)
      var envCanvas = env.createCanvas(config.envCanvasWidth, config.envCanvasHeight);
      envCanvas.parent('highlighting-canvas'); // add parent div 

      this.setupBoundaries();

    }.bind(this);

    // create block objects and update world map
    this.blocks = this.targetBlocks.map(block => {

      for (let y = block.y; y < block.y + block.height; y++) {
        for (let x = block.x; x < block.x + block.width; x++) {
          this.discreteWorld[x][y] = false;
        }
      }
      return new Block(this.engine, this.blockKinds[String([block.width,block.height])], 0, 0, false, false, block.x, block.y);
    });

    gridDisplay.setStimGrid(this.discreteWorld);

    let nColors = 5; // TODO: grab from trial object
    let highlightGrid = new HighlightGrid(gridDisplay, nColors);

    env.draw = function () { // Called continuously by Processing JS 
      env.background(220);
      this.ground.show(env);
      this.leftSide.show(env);
      this.rightSide.show(env);
      // display.showStimFloor(env);

      this.blocks.forEach(b => {
        b.show(env);
      });

      gridDisplay.show(env);

    }.bind(this);


    env.mouseClicked = function () {

      // if (!this.disabledBlockPlacement) {

      //   // if mouse in main environment
      //   if (env.mouseY > 0 && (env.mouseY < config.envCanvasHeight - config.menuHeight) &&
      //     (env.mouseX > 0 && env.mouseX < config.envCanvasWidth)) {
      //     if (this.isPlacingObject) {
      //       // test whether all blocks are sleeping
      //       this.sleeping = this.blocks.filter((block) => block.body.isSleeping);
      //       this.allSleeping = this.sleeping.length == this.blocks.length;

      //       this.time_placing = Date.now();

      //       if ((this.allSleeping || (this.time_placing - this.timeLastPlaced > 3000)) &&
      //         ((env.mouseX > (config.sF * (this.selectedBlockKind.w / 2))) &&
      //           (env.mouseX < config.envCanvasWidth - (config.sF * (this.selectedBlockKind.w / 2))))) {
      //         // SEND WORLD DATA AFTER PREVIOUS BLOCK HAS SETTLED
      //         // Sends information about the state of the world prior to next block being placed
      //         this.placeBlock(env);
      //       }
      //     }
      //   }

      //   // or if in menu then update selected blockkind
      //   if (env.mouseY > 0 && (env.mouseY < config.envCanvasHeight) &&
      //     (env.mouseX > 0 && env.mouseX < config.envCanvasWidth)) {

      //     // is mouse clicking a block?
      //     var newSelectedBlockKind = this.blockMenu.hasClickedButton(env.mouseX, env.mouseY, this.selectedBlockKind);
      //     if (newSelectedBlockKind) {
      //       if (newSelectedBlockKind == this.selectedBlockKind) {
      //         this.timeBlockSelected = Date.now();
      //         //rotated = !rotated; // uncomment to allow rotation by re-selecting block from menu
      //       } else {
      //         this.rotated = false;
      //       }
      //       this.selectedBlockKind = newSelectedBlockKind;
      //       this.isPlacingObject = true;
      //     }
      //   }
      // }
    }.bind(this);
  };

  checkTrialEnd() {

    if (this.trialObj.endCondition == null) {
      // do nothing

    } else if (this.trialObj.endCondition == 'example-end-condition') {
      // TODO: implement check for condition i.e. have people filled in all of the structure?
        this.endBuilding();

    } else {
      //unsupported endCondition: do nothing
    }

  }

  endBuilding() {
    console.log('end of trial');

    let trialData = _.extend({},
      this.getCommonData(),
      {
        eventType: 'trial_end',
        endReason: this.trialObj.endCondition
      });

    this.trialObj.endBuildingTrial ? this.trialObj.endBuildingTrial(trialData) : console.log('no trialEnd function provided. Please specify in trial object');
  }


  sendBlockData() {
    let blockData = _.extend({},
      this.getCommonData(),
      {
        eventType: 'block_placement',
        block: this.blocks[this.blocks.length-1].getDiscreteBlock()
      });

    this.trialObj.blockSender ? this.trialObj.blockSender(blockData) : console.log('no blockSender function provided. Please specify in trial object');
  }



  removeEnv() {
    // remove environment
    this.env.remove();

    // Update variables
    this.blocks = [];
    this.blockKinds = {};
    this.isPlacingObject = false;
    this.rotated = false;
    this.selectedBlockKind = null;
  }

  removeStimWindow() {
    // remove environment
    this.env.remove();
  }


  getBlockColorIndex(dims) {

    var i = 0;
    while (((dims[0] != config.blockDims[i][0]) || (dims[1] != config.blockDims[i][1])) & (i < config.blockDims.length)) {
      i += 1;
    }
    if ((dims[0] == config.blockDims[i][0]) & (dims[1] == config.blockDims[i][1])) {
      return i;
    }

    else (console.log('no color found for block of dimensions ', dims));

  };

  getCommonData() {

    var commonData = {
      //timing
      timeAbsolute: Date.now(),
      timeRelative: Date.now() - this.trialStart,
      blocks: this.getBlockJSON(),
      discreteWorld: this.discreteWorld
    };

    return commonData;
  };

  getBlockJSON() {
    return _.map(this.blocks, (block) => {
      return block.getDiscreteBlock();
    });
  };

  shiftTower(discreteXOffset){

    this.discreteWorldPrevious = _.cloneDeep(this.discreteWorld);
    
    let canShift = _.reduce(this.blocks, function(acc, block){

      return (block.testShift(discreteXOffset, config.discreteEnvWidth) && acc)

    }, true)

    if (canShift) {
      this.blocks = _.map(this.blocks, (block) => {block.shiftBlock(discreteXOffset)});
      // update block map!!
    }


  }

};

module.exports = BlockUniverse;
