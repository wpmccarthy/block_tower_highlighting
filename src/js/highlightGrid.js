var ChunkCanvas = require("./chunkCanvases.js")["ChunkCanvas"];

class HighlightGrid {
    constructor(gridDisplay, nColors ) {
        this.gridDisplay = gridDisplay;
        this.nColors = config.highlightColors.length - 1; // -1 because first is default color
        // this.setupElements(); // TODO: set up buttons etc
    
        this.newGrid();
    }

  newGrid(){
    this.gameGrid = Array(config.discreteEnvWidth)
    .fill()
    .map(() => Array(config.discreteEnvHeight).fill(0));

    this.gridDisplay.setGameGrid(this.gameGrid);
  }

  onTarget(i, j) {
    return this.currentTrial.stimGrid[i][j];
  }

  increment(i, j) {
    this.gameGrid[i][j] =
      this.gameGrid[i][j] + 1 < this.nColors + 1 ? this.gameGrid[i][j] + 1 : 1;

    this.gridDisplay.setGameGrid(this.gameGrid);
  }

  activeChunks() {
    /**
     * Returns list of chunk numbers that are presently used to highlight
     */
    // console.log(_.uniq(_.flatten(this.gameGrid)));
    return _.uniq(_.flatten(this.gameGrid));
  }

  nChunksHighlighted() {
    /**
     * Returns number of active highlight colors
     */

    return this.activeChunks().length - 1;
  }

  nSquaresHighlighted() {
    let nHighlightedSquares = _.sum(_.map(_.flatten(this.gameGrid), (x) => {return (x > 0 ? 1 : 0)}));
    return nHighlightedSquares;
  }

  filledShape(){
    return this.nSquaresHighlighted() == this.currentTrial.nSquaresInTarget();
  }

  done(){
    //check if any blocks placed this turn, and let partner know if none placed
    if (this.nSquaresHighlighted() == this.currentTrial.nSquaresInTarget()){

      if(this.currentTrial.successCondition !== null){
        if(this.currentTrial.successCondition(this.gameGrid)){
          this.saveData('trialEnd');

          this.currentTrial.trialNum == this.ntrials ? this.endGame() : this.nextTrial();

        } else {
          console.log('did not pass condition');
          $('#practice-feedback').show();
        };
      } else {

        this.saveData('trialEnd');

        this.currentTrial.trialNum == this.ntrials ? this.endGame() : this.nextTrial();
        
      };
    }
    else {
      console.log('you haven\'t filled in the whole structure!');
    };

  };

  reset(){
    this.currentTrial.nReset += 1;
    this.currentTrial.timeReset = Date.now();
    this.newGrid();

    $("#chunk-counter").text(
        this.nChunksHighlighted().toString() + " parts selected"
      );
  }


  setupElements(){

    /**
     * These button interactions are in a silly place- I should move them outside of this class at some point
     */

    $("#done-button").click(() => {
        this.done();
        // This prevents the form from submitting & disconnecting person
        return false;
      });

    $("#done-button")
    .mouseover(() => {
        if (!this.filledShape()){
            $("#unfinished-shape").show();
        }
    })
    .mouseout(() => {
        $("#unfinished-shape").hide();
    })
    ;
  
    $("#reset-button").click(() => {
          this.reset();
          // This prevents the form from submitting & disconnecting person
          return false;
        });

    $('#surveySubmit').click(() => {
      this.submit();
      return false;
    });

    // $('.form-group').change({},this.dropdownTip)

  }

  submit () {
    $('#thanks').show();
    $('#surveySubmit').hide();
    let surveyData = _.extend(this.dropdownData ,{
      'comments' : $('#comments').val().trim().replace(/\./g, '~~~'),
      'strategy' : $('#strategy').val().trim().replace(/\./g, '~~~'),
      'didCorrectly' : $('#didCorrectly option:selected').text(),
      'colorBlind' : $('#color option:selected').text(),
      'totalTimeAfterInstructions' : Date.now() - this.gameStartTime
    });
    //console.log("data is...");
    //console.log(game.data);
    this.saveData('survey', surveyData);

    this.gameFinished = true;

    if(urlParams.prolificPID != 'undefined'){
      
      setTimeout(() => {
        location.replace("https://app.prolific.co/submissions/complete?cc=751095B3");
      }, 500);
    }

  }

  endGame(){
    $("#main_div").hide();
    $("#exit_survey").show();
  }

}


module.exports = HighlightGrid;
