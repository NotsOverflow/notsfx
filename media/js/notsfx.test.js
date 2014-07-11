/*----------------------------------------------------------------------------|
                                                              _____           |
      Autor: Notsgnik                                       /||   /           |
      Email: Labruillere gmail.com                         / ||  /            |
      website: notsgnik.github.io                         /  || /             |
      License: GPL v3                                    /___||/              |
      																		  |
------------------------------------------------------------------------------*/

documentReady(function(){
	var nfx = Nfx({mediaElement : 'somediv', verbosity : 2});
	nfx.debug('[ info ] Using Nfx !');
	nfx.run = function(){
		var string = "";
		for (var key in nfx._pressedKeys){
			string = string + ', \'' + nfx._pressedKeys[key] + '\'';
		}
		if(string == "") string = "?!None" ;
		this.mediaElement.innerHTML = 'Pressed keys : ' + string.substring(2);
		return true;
	};
});