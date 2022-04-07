class BuildingWidget {
    /**
     * To
     */

    // Setup default variables shared across all possible variations of this widget
    constructor () {
        
    };

    // Setup widget for a specific trial.
    // TrialObj is used to specify information that is specific to each instance of this widget within a project (for shared properties e.g. size of environment use blockConfig).
    setupWidget(trialObj) {
        var localThis = this;
        this.trialObj = trialObj;
    
        this.targetBlocks = display.translateTower(this.trialObj.stimulus, this.trialObj.offset); 
    
        this.env = new p5((env) => {
          localThis.setupHighlightingCanvas(env);
        }, 'highlighting-canvas');
    
      };

    // Setup p5 canvas environments
    setupHighlightingCanvas(env) {
        
        // define what happens when p5 canvas initializes
        env.setup = function () {

        };

        // define what happens when p5 canvas renders
        env.draw = function () {

        };

    };

}