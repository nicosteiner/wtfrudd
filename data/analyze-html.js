var WTFRUDD = WTFRUDD || {};

WTFRUDD.Analyze = {};

// communication

if (self) {

  self.port.on('analyze-now', function() {

    WTFRUDD.Analyze.analyzeNow();

  });

}

// define ruleset

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
    
    // switch between rules and functions
    
    if (currentRuleset.rules) {
    
      for (j = 0; j < currentRuleset.rules.length; j += 1) {
      
        // check rule matchings
        
        if (document.querySelector(currentRuleset.rules[j])) {
        
          self.port.emit('add-title', currentRuleset.title + ' (' + currentRuleset.rules[j] + ')');
          
          break;
        
        }
      
      }
    
    } else if (currentRuleset.execute) {
    
      if (!currentRuleset.execute()) {
      
        self.port.emit('add-title', currentRuleset.title);
        
      }
    
    }
  
  }

};