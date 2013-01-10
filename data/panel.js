if (self) {

  // messages from the add-on script land here
  // see: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/guides/content-scripts/using-port.html

  self.on('message', function(commandMessage) {

    var container, title, linkDiv;
  
    if (commandMessage.command === 'clear-panel') {

      // resets panel content
      // remove all HTML tags from container and and positive message
    
      container = document.getElementById('results');

      while (container.firstChild) {
      
        container.removeChild(container.firstChild);
        
      }
      
      container.innerHTML = 'Yo Dude!';
      
    } else if (commandMessage.command === 'add-title') {

      // error message output
      // for each error coming in a new div containing the error text ist created
    
      container = document.getElementById('results');

      container.innerHTML = '';

      title = commandMessage.data;

      linkDiv = document.createElement('div');
      
      linkDiv.className = 'resultElement';

      container.appendChild(linkDiv.appendChild(document.createTextNode(title)));

    }
    
  });
  
}
