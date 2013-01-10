var WTFRUDD = WTFRUDD || {};

WTFRUDD.Analyze = {};

// communication with add-on script
// Doc says: "To enable add-on scripts and content scripts to communicate with each other, each end of the conversation has access to a port object."
// see: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/guides/content-scripts/using-port.html

if (self) {

  self.port.on('analyze-now', function() {

    WTFRUDD.Analyze.analyzeNow();

  });

}

// here comes the custom add-on logic (only a demo prototype)

// define ruleset
// there are 2 kinds of rules:
// - "normal" ones coming along as selector strings checked with JavaScript Selectors API
// - "executable" functions for complex logic: returning true means, the test was successful and rule was not broken

WTFRUDD.Analyze.ruleset = [{

    title: 'This dude thinks a11y is a girls name funny written!',
    
    rules: ['.label', '.headline', '.h1', '.h2', '.h3', '.bold', 'table .head', 'table .body', 'table .footer']
    
  }, {
  
    title: 'Take you time, dude!',
    
    execute: function() {
      
      var pageLoadTime;
      
      if (window.performance) {
      
        pageLoadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000;
        
        // works only asynchronously :-(
        
        /*
        if (pageLoadTime < 3) {
        
          return true;
          
        } else {
          
          return false;
          
        }
        */
      
      }
      
      return true;
      
    }
    
  }
  
];

WTFRUDD.Analyze.analyzeNow = function() {

  var i,
      j,
      currentRuleset,
      analyzeResult = [];
  
  for (i = 0; i < WTFRUDD.Analyze.ruleset.length; i += 1) {
  
    currentRuleset = WTFRUDD.Analyze.ruleset[i];
    
    // switch between normal rules and executable functions
    
    if (currentRuleset.rules) {
    
      for (j = 0; j < currentRuleset.rules.length; j += 1) {
      
        // check normal rules matching
        // see: http://www.w3.org/TR/2012/PR-selectors-api-20121213/
        
        if (document.querySelector(currentRuleset.rules[j])) {
        
          // send message to add-on script (and from there further to panel script for output)
          // see comment at top for details
        
          self.port.emit('add-title', currentRuleset.title + ' (' + currentRuleset.rules[j] + ')');
          
          break;
        
        }
      
      }
    
    } else if (currentRuleset.execute) {
    
      // returning true means, the test was successful and rule was not broken
    
      if (!currentRuleset.execute()) {
      
        // send message to add-on script (and from there further to panel script for output)
        // see comment at top for details
        
        self.port.emit('add-title', currentRuleset.title);
        
      }
    
    }
  
  }

};