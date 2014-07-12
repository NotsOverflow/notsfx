/*----------------------------------------------------------------------------|
                                                              _____           |
      Autor: Notsgnik                                       /||   /           |
      Email: Labruillere gmail.com                         / ||  /            |
      website: notsgnik.github.io                         /  || /             |
      License: GPL v3                                    /___||/              |
      																		  |
------------------------------------------------------------------------------*/

documentReady(function(){
	var someTimeStamp = new Date().getTime();
	var someFPS = 0;
	var someCount = 0;
	var nfx = Nfx({mediaElement : 'somediv', verbosity : 2});
	nfx.debug('[ info ] Using Nfx !');
	nfx.run = function(){

		// FPS count
		if((new Date().getTime() - someTimeStamp) >= 999){
			someTimeStamp = new Date().getTime();
			someFPS = someCount;
			someCount = 0;
		}
		someCount = someCount + 1 ;

		// Pressed keys
		var string = "";
		for (var key in nfx._pressedKeys){
			string = string + ', \'' + nfx._pressedKeys[key] + '\'';
		}
		if(string == "") string = "?!None" ;

		// Display infos
		this.mediaElement.innerHTML = "NotsFX<\BR>FPS : " + someFPS + "<\BR>Pressed keys : " + string.substring(2);

		// Run need to return true to continue running
		return true;
	};
});