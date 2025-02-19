// var config = require('./display_config.js');

function showStimulus(env, stimulus, individual_blocks = false) {
  Array.prototype.forEach.call(stimulus, block => {
    showBlock(env, block, individual_blocks);
  });
}

function showReconstruction(env, stimulus, individual_blocks = false) {
  Array.prototype.forEach.call(stimulus, block => {
    showBlock(env, block, true, block.color);
  });
}

function drawStimChocolateBlocks(env, nRow, nCol) {

  env.strokeWeight(3);

  // draws unit squares on each block
  var i = -nRow / 2 + 0.5;
  while (i < nRow / 2) {
    var j = -nCol / 2 + 0.5;
    while (j < nCol / 2) { // draw one square
      env.translate(config.sF * i, config.sF * j);
      env.rect(0, 0, config.sF, config.sF);
      env.translate(-config.sF * i, -config.sF * j);
      j++;
    }
    i++;
  }
}


function showBlock(env, block, individual_blocks = false) {
  const width = block.width;
  const height = block.height;
  const x_left = block.x - config.worldWidth / 2;
  const x_center = x_left + block.width / 2;
  //const y_bottom = config.worldHeight - (config.worldHeight / 2) - block.y;
  //const y_bottom = config.worldHeight - block.y;
  const y_center = block.y + block.height / 2;

  env.push(); //saves the current drawing style settings and transformations

  env.rectMode(env.CENTER);
  //env.translate(config.stimX + config.stim_scale * x_center, (config.canvasHeight - config.floorHeight));
  // env.fill([255,0,0]);
  // env.rect(0, 0, 10, 10);


  env.translate(config.stimX + config.stim_scale * x_center,
    ((config.canvasHeight - config.floorHeight) - (config.stim_scale * y_center)));

  //draw fill
  env.fill(block.color);
  env.noStroke();

  // env.stroke(config.strokeColor);
  env.rect(0, 0, config.stim_scale * width, config.stim_scale * height);

  // draw internal squares
  if (individual_blocks) {
    env.fill(block.color);
    env.stroke(block.internalStrokeColor);
    drawStimChocolateBlocks(env, width, height);
    // env.stroke([240, 225, 0]);
  }

  // draw rectangle
  env.noFill();
  env.stroke(config.strokeColor);
  env.strokeWeight(3);
  env.rect(0, 0, config.stim_scale * width, config.stim_scale * height);
  env.pop();

}

class Grid {
  constructor(grid_left = -9, grid_right = 11, grid_bottom = 0, grid_top = 20) {
    this.grid_left = grid_left;
    this.grid_right = grid_right;
    this.grid_bottom = grid_bottom;
    this.grid_top = grid_top;
  }

  setup() {
    this.grid_x = new Array(this.grid_right - this.grid_left);
    this.grid_y = new Array(this.grid_top - this.grid_bottom);

    let i = this.grid_left;

    while (i < this.grid_right) {
      this.grid_x[i] = config.stim_scale * i + config.canvasWidth / 2 - config.stim_scale / 2;
      i = i + 1;
    }

    let j = this.grid_bottom;
    while (j < this.grid_top) {
      this.grid_y[j] = (config.canvasHeight - config.floorHeight) - (config.stim_scale / 2) - (config.stim_scale * j);
      j = j + 1;
    }
  }

  show(env) {
    var squareWidth = config.stim_scale;
    var squareHeight = config.stim_scale;

    // const grid_left = -9;
    // const grid_right = 11;
    // const grid_bottom = 0;
    // const grid_top = 20;

    let i = this.grid_left;
    while (i < this.grid_right) {
      let j = this.grid_bottom;
      while (j < this.grid_top) {
        env.push();
        env.rectMode(env.CENTER);
        env.stroke([190, 190, 255]);
        env.noFill();
        env.translate(this.grid_x[i], this.grid_y[j]);
        env.rect(0, 0, squareWidth, squareHeight);
        env.pop();
        j = j + 1;
      }
      i = i + 1;
    }
  }
}

function showStimFloor(p5stim, floorType, showTickMark) {
  const floorX = config.stimCanvasWidth / 2,
    floorY = config.floorY;
  p5stim.push();
  if (floorType == 'line') { // line floor
    p5stim.stroke(config.stimFloorColor);
    p5stim.strokeWeight(3);
    p5stim.line(floorX - (config.floorWidth / 2),
      floorY - (config.floorHeight / 2) + 3, //+3 for linewidth
      floorX + (config.floorWidth / 2),
      floorY - (config.floorHeight / 2) + 3); //+3 for linewidth

    // center tick
    if (showTickMark) {
      p5stim.line(
        floorX,
        floorY - (config.floorHeight / 2) + 3, //+3 for linewidth
        floorX,
        floorY - (config.floorHeight / 2) + 23, //+3 for linewidth + 20 for tick
      );
    };

  } else { // solid floor
    p5stim.stroke(220);
    p5stim.strokeWeight(2);
    const floorHeight = config.floorHeight,
      floorWidth = config.stimCanvasWidth * 1.5;
    p5stim.translate(floorX, floorY);
    p5stim.rectMode(p5stim.CENTER);
    p5stim.fill([28, 54, 62]);
    p5stim.rect(0, 0, floorWidth, floorHeight);
    //showMarkers(p5stim);
  }
  p5stim.pop();

}

// function showStimFloor(p5stim) {
//   const floorX = config.stimCanvasWidth / 2,
//     floorY =config.floorY,
//     floorWidth = config.stimCanvasWidth * 1.5,
//     floorHeight = config.floorHeight;
//   p5stim.push();
//   p5stim.translate(floorX, floorY);
//   p5stim.rectMode(p5stim.CENTER);
//   p5stim.stroke(220);
//   p5stim.strokeWeight(2);
//   p5stim.fill([28, 54, 62]);
//   p5stim.rect(0, 0, floorWidth, floorHeight);
//   p5stim.pop();
//   showMarker(p5stim);
// }

function showMarkers(p5stim) {
  p5stim.push();
  p5stim.stroke([255, 0, 0]);
  p5stim.strokeWeight(1);
  p5stim.line(
    config.canvasWidth / (4 / 3),
    config.canvasHeight - config.floorHeight,
    config.canvasWidth / (4 / 3),
    config.canvasHeight - config.floorHeight + 15
  );
  p5stim.line(
    config.canvasWidth / 4,
    config.canvasHeight - config.floorHeight,
    config.canvasWidth / 4,
    config.canvasHeight - config.floorHeight + 15
  );
  p5stim.pop();
}


function translateTower(targetBlocks, xOffset, yOffset) {
  if (xOffset == null) {
    xOffset = config.xSquareOffset;
  }
  if (yOffset == null) {
    yOffset = config.ySquareOffset;
  }
  let translated = targetBlocks.map((block) => ({
    x: block.x + xOffset,
    y: block.y + yOffset,
    height: block.height,
    width: block.width
  }));
  return translated
};

module.exports = {
  showStimulus,
  showReconstruction,
  showMarkers,
  showStimFloor,
  translateTower,
  grid: new Grid(-19, 21, 0, 30)
};
