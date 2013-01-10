var pageMod = require('page-mod');
var data = require("self").data;
var tabs = require("tabs");
var widgets = require('widget');
var panel = require("panel");

pageMod.PageMod({

  include: '*',
  
  contentScriptFile: data.url('analyze-html.js'),
  
  onAttach: function(worker) {

    if (resultPanel) {
  
      resultPanel.postMessage({ command: 'clear-panel', data: null });
      
    }
    
    if (widget) {
    
      widget.contentURL = data.url('img/ok.png');
      
    }
    
    worker.port.emit('analyze-now');
    
    worker.port.on('add-title', function(title) {
    
      widget.contentURL = data.url('img/error.png');
    
      resultPanel.postMessage({ command: 'add-title', data: title });
    
    });
  
  }
  
});

var resultPanel = panel.Panel({

  width: 500,
  
  height: 300,
  
  contentURL: data.url('panel.html'),
  
  contentScriptFile: data.url('panel.js')

});

var widget = widgets.Widget({

  id: 'wtfrudd@nicosteiner.de',
  
  label: 'What the fuck R U doing dude?',
  
  contentURL: data.url('img/ok.png'),

  onClick: function() {
    
    resultPanel.show();
        
  }

});
