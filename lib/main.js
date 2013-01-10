var pageMod = require('page-mod');
var data = require("self").data;
var tabs = require("tabs");
var widgets = require('widget');
var panel = require("panel");

// for module page-mod see: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/page-mod.html
// Doc says: "The page-mod module enables you to run scripts in the context of specific web pages."
// content script has access to the documents shown in the browser tabs

pageMod.PageMod({

  include: '*',
  
  contentScriptFile: data.url('analyze-html.js'),
  
  onAttach: function(worker) {

    // when content script is ready...
  
    // clear panel output (new page, new luck...)
  
    if (resultPanel) {
  
      resultPanel.postMessage({ command: 'clear-panel', data: null });
      
    }
    
    // reset add-on status graphic in the add-on bar to "ok"
    
    if (widget) {
    
      widget.contentURL = data.url('img/ok.png');
      
    }
    
    // analyze the document shown in the browser window
    // this message is sent to the content script (analyze.js)
    
    worker.port.emit('analyze-now');
    
    // these messages comes from the content script (analyze.js) when a rule was broken
    
    worker.port.on('add-title', function(title) {
    
      // change add-on status graphic in the add-on bar to "error"
    
      widget.contentURL = data.url('img/error.png');
    
      // pass error message to the panel script (panel.js) for output
    
      resultPanel.postMessage({ command: 'add-title', data: title });
    
    });
  
  }
  
});

// for module panel see: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/panel.html
// Doc says: "A panel is a dialog. Its content is specified as HTML and you can execute scripts in it."
// Panel is used to output the error messages

var resultPanel = panel.Panel({

  width: 500,
  
  height: 300,
  
  contentURL: data.url('panel.html'),
  
  contentScriptFile: data.url('panel.js')

});

// for module widget see: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/widget.html
// Doc says: ""Widgets" are small pieces of content that live in the Firefox 4 add-on bar."
// The Widget comes as a status graphic (ok = green check, error = red cross) in the lower right corner of the browser (add-on bar)
// When you click it, the panel with the error messages opens

var widget = widgets.Widget({

  id: 'wtfrudd@nicosteiner.de',
  
  label: 'What the fuck R U doing dude?',
  
  contentURL: data.url('img/ok.png'),

  onClick: function() {
    
    resultPanel.show();
        
  }

});
