if (self) {

  self.on('message', function(commandMessage) {

    var container, title, linkDiv;
  
    if (commandMessage.command === 'clear-panel') {

      container = document.getElementById('results');

      while (container.firstChild) {
      
        container.removeChild(container.firstChild);
        
      }
      
      container.innerHTML = 'Yo Dude!';
      
    } else if (commandMessage.command === 'add-title') {

      container = document.getElementById('results');

      container.innerHTML = '';

      title = commandMessage.data;

      linkDiv = document.createElement('div');
      
      linkDiv.className = 'resultElement';

      container.appendChild(linkDiv.appendChild(document.createTextNode(title)));

    }
    
  });
  
}
