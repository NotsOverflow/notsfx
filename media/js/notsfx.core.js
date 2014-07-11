/*----------------------------------------------------------------------------|
                                                              _____           |
      Autor: Notsgnik                                       /||   /           |
      Email: Labruillere gmail.com                         / ||  /            |
      website: notsgnik.github.io                         /  || /             |
      License: GPL v3                                    /___||/              |
      																		  |
------------------------------------------------------------------------------*/


var Nfx = function(options){
	
	// essential stuff

	this._options = mergeObj({
		run : true,
		verbosity : 1,
		mediaElement : false,
		getCams : false
	}, options || {});

	this.debug = function(string, level){
		level = level || 1;		
		if( this._options.verbosity >= level ){
			console.log('log: ' + string);
		}
	};


	// core atributes
	this.mediaElement = false;
	this._keyUpOrder = {};
	this._keyDownOrder = {};
	this._pressedKeys = {};
	this._window = window;
	this._timeStamp = 0;
	this._deltaTime = 0;
	this._targetFps = 60;
	this._loopInterval = false;
	this._loopIntervalTime = 10;
	this._tweekedDown = false;
	this._tweekCount = 0;
	this._beforTweek = 2000;

	// core functions

	this._keydown = function(e){
		var unikey = String(e.keyCode? e.keyCode : e.charCode);
		if(this._keyDownOrder[unikey] == undefined){
			this._keyDownOrder[unikey] = nfxCharMap[unikey] ;
			this.debug('[ info ] KeyDown : '+ nfxCharMap[unikey] +' ( ' + unikey +' )' , 3);
		}
	};
	this._keyup = function(e){
		var unikey = e.keyCode? e.keyCode : e.charCode;
		if(this._keyUpOrder[unikey] == undefined){
			this._keyUpOrder[unikey] = nfxCharMap[unikey] ;
			this.debug('[ info ] KeyUp : '+ nfxCharMap[unikey] +' ( ' + unikey +' )' , 3);
		}
	};

    this._keyTaker = function(){
		for ( var attr in this._keyDownOrder){
			if(this._pressedKeys[attr] == undefined){
				this._pressedKeys[attr] = this._keyDownOrder[attr];
				this.debug('[ info ] Pressed Key : \''+ this._keyDownOrder[attr] +'\' ( ' + attr +' )' , 2);
			}
		}
		var tmp = {};
		var notFound = true;
		for(var attr_k in this._pressedKeys){
			notFound = true;
			for ( var attr_u in this._keyUpOrder){
				if(attr_k == attr_u){
					notFound = false;
				}
			}
			if(notFound){
				tmp[attr_k] = this._pressedKeys[attr_k];
			}
			else{
				this.debug('[ info ] UnPressed Key : \''+ this._keyUpOrder[attr_k] +'\' ( ' + attr_k +' )' , 2);
			}
		}
		this._pressedKeys = tmp ;
		this._keyDownOrder = {};
		this._keyUpOrder = {};
	};

	this._setTimeStamp = function(){
		this._timeStamp = new Date().getTime();
	};
	
	this._getDeltaTime = function(){
		return ( new Date().getTime() - this._timeStamp );
	};
	
	this._setDeltaTime = function(){
		this._deltaTime = Math.floor( 1000 / this._targetFps );
	};
	this._sleep = function(milliseconds) {
  		var start = new Date().getTime();
  		for (var i = 0; i < 1e7; i++) {
    		if ((new Date().getTime() - start) > milliseconds){
      			break;
    		}
  		}
	};

	this._doLoop = function(){
		if(this._options.run == true){
			this.debug('[ info ] inside loop ',3);
			if( this._getDeltaTime() >= this._deltaTime ){
				this._keyTaker();
				this._setTimeStamp();
				if(!this.run()){
					this._window.clearTimeout(this._loopInterval);
					this.exit();
					this._exit();
					return true;
				}
				if(this._getDeltaTime >= this._deltaTime){
					this.debug('[ info ] Your computer is to slow ! tweeking down ...', 2);
					this.tweekDown();
					this._tweekedDown = true;
				}
				else{
					if(this._tweekedDown == false){
						if(this._tweekCount > this._beforTweek){
							this.debug('[ info ] Your computer is quick ! tweeking up ...', 2);
							this.tweekUp();
							this._tweekCount = 0;
						}
						else{
							this._tweekCount = this._tweekCount + 1;
						}
					}
				}
				this.debug('[ info ] Looping now',3);
				this._loopInterval = this._window.setTimeout(function(){this._doLoop()}.bind(this), 0);
			}
			else{
				this.debug('[ info ] setting loop interval to ' + this._loopIntervalTime ,3);
				this._loopInterval = this._window.setTimeout(function(){this._doLoop()}.bind(this), this._loopIntervalTime);
			}
		}
		else{
			this._window.clearTimeout(this._loopInterval);
			this.pause();
		}
	};

	this._init = function(){
		this.init();
		if(this._options.run == false){
			this.beforeStart();
		}
		else{
			this._doLoop();
		}
	};

	this._exit = function(){
		this.debug('[ info ] exiting function', 2);
		this._window.clearTimeout(this._loopInterval);
	};

    // user edited functions

    this.init = function(){
    	this.debug('[ warning ] init function is not set and must be');
    };
    this.beforeStart = function(){
    	this.debug('[ warning ] beforeStart function is not set and must be if you don\'t run automaticly ');
    };
    this.run = function(){
    	this.debug('[ warning ] run function is not set and must be');
    	return false;
    };
    this.tweekUp = function(){
		this.debug('[ warning ] function tweekUp is not set and it look like it\'s needed ...');
	};
	this.tweekDown = function(){
		this.debug('[ warning ] function tweekDown is not set and it look like it\'s needed ...');
	};
    this.pause = function(){
    	this.debug('[ warning ] pause function is not set and must be');
    };
    this.exit = function(){
    	this.debug('[ warning ] exit function is not set and must be');
    };

    // stuff to run while the object is created

    if(this._options.mediaElement){
		this.mediaElement = document.getElementById(this._options.mediaElement) ;	
		if(!this.mediaElement){
			nfx.debug("[ error ] Given element '" + this._options.mediaElement + "' not found",0);
			return undefined;
		}
		if(typeof this.mediaElement != 'object'){
			this.debug('[ error ] HTML element needed to use Nfx !', 0);
			return undefined;
		}
	}

    documentClose(function(){
		this.exit();
		this._exit();
	}.bind(this));

	this._windowListenerD = this._window.addEventListener('keydown',function(e) { this._keydown(e);}.bind(this),false);
    this._windowListenerU = this._window.addEventListener('keyup',function(e) { this._keyup(e);}.bind(this),false);
    this._setTimeStamp();
    this._setDeltaTime();

    this._init();

	return this;
};