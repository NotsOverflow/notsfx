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
		getCaputreDevices : false,
		resolutions : {
			"fullScreen" : ["1920","1080"], // change over time
			"1080p" : ["1920","1080"],
			"720p":["1280","720"],
			"480p":["854","480"],
			'17"' : ["1280","720"],
			"360p" : ["640", "360"]
		},
		selectedRes : "360p",
		camAccessTimeout : 30,
		enableCamAudio : true,
		targetFps : 60,
		loopIntervalTime : 10,
		noTweek : false,
		loopsBeforTweek : 2000

	}, options || {});

	this.debug = function(string, level){
		level = level || 1;		
		if( this._options.verbosity >= level ){
			console.log('log: ' + string);
		}
	};

	// core atributes
	this._keyUpOrder = {};
	this._keyDownOrder = {};
	this._pressedKeys = {};
	this._window = window;
	this._timeStamp = 0;
	this._deltaTime = 0;
	this._loopInterval = false;
	this._tweekedDown = false;
	this._tweekCount = 0;
	this._gotCaptureDevices = false;
	this._audioSource = [];
	this._videoSource = [];
	this._window.streams = [];
	this._camCount = 0;
	this._micCount = 0;
	this._videoAsked = false;
	this._camTimeoutInterval = false;
	this._handleVideoCount = 0;

	// user accessible atribute


	this.mediaElement = false;
    this.resolution = this._options.resolutions[this._options.selectedRes];
	this.videoSources = [];

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

	this._setFullScreenSize = function(){
		this._options.resolutions["fullScreen"][0] = parseInt(window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth);
		this._options.resolutions["fullScreen"][1] = parseInt(window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight);
		this.resolution = this._options.resolutions[this._options.selectedRes];
		return this._options.resolutions["fullScreen"];
	};
	this._resizeScreen = function(){
		this.resizeEvent(this._setFullScreenSize());
	};

	this._setTimeStamp = function(){
		this._timeStamp = new Date().getTime();
	};
	
	this._getDeltaTime = function(){
		return ( new Date().getTime() - this._timeStamp );
	};
	
	this._setDeltaTime = function(){
		this._deltaTime = Math.floor( 1000 / this._options.targetFps );
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
				if(!this.run()){
					this._window.clearTimeout(this._loopInterval);
					this.exit();
					this._exit();
					return true;
				}
				this._setTimeStamp();
				if(this._getDeltaTime >= this._deltaTime && this._options.noTweek == false){
					this.debug('[ info ] Your computer is to slow ! tweeking down ...', 2);
					this.tweekDown();
					this._tweekedDown = true;
				}
				else{
					if(this._tweekedDown == false  && this._options.noTweek == false){
						if(this._tweekCount > this._options.loopsBeforTweek){
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
				this.debug('[ info ] setting loop interval to ' + this._options.loopIntervalTime ,3);
				this._loopInterval = this._window.setTimeout(function(){this._doLoop()}.bind(this), this._options.loopIntervalTime);
			}
		}
		else{
			this._window.clearTimeout(this._loopInterval);
		}
	};

	this._init = function(){
		if(this._options.getCaputreDevices == true
		&& this._gotCaptureDevices == false){
			// only webkit for now
			if(!MediaStreamTrack.getSources(this._getDeviceListWebkit)){
				this.debug('[ error ] Capture devices are not compatible with your browser',0);
				this._exit();
			}
		}
		else{
			this.init();
			if(this._options.run == false){
				this.beforeStart();
			}
			else{
				this._doLoop();
			}
		}
		
	};
	this._getDeviceListWebkit = function(sourceInfos) {
		for (var i = 0; i != sourceInfos.length; ++i) {
			var sourceInfo = sourceInfos[i];
			if (sourceInfo.kind === 'audio') {
				this.debug('[ info ] audio device : id / label | ' +sourceInfo.id +' / ' + (sourceInfo.label || 'microphone'),2);
				this._audioSource.push([sourceInfo.id,(sourceInfo.label || 'microphone')]);
				this._micCount = this._micCount + 1;
			} else if (sourceInfo.kind === 'video') {
				this.debug('[ info ] video device : id / label | ' + sourceInfo.id +' / ' + (sourceInfo.label || 'camera'),2);
				this._videoSource.push([sourceInfo.id,(sourceInfo.label || 'camera')]);
				this._camCount = this._camCount + 1;
			} else {
				this.debug('[ info ] other kind of device : ' +sourceInfo, 2);
			}
		}
		this.debug('[ info ] device arrays : audio / video | ' + this._audioSource +' / ' + this._videoSource,3);
		this._gotCaptureDevices = true;
		this._init();
	};
	this._gotVideoAccess = function(stream){
		this._handleVideoCount = this._handleVideoCount + 1;
		this._window.streams.push(stream) ;
		this.videoSources.push(window.URL.createObjectURL(stream));

		if(this._handleVideoCount == this._camCount){
			this.debug('[ info ] All cameras allowed succesfully' ,2);
			window.clearTimeout(this._camTimeoutInterval);
			this.camAccessHandler(this.videoSources);
		}
		
	};
	this._gotVideoAccessError = function(e){
		this.debug("[ error ] Can't access webcam -> " + e.name, 0 );
		this.camAccessError(e.name);
	};
	this._cameraTimeoutFunction = function(){
		if(this._cameraLoaded == false){
			this.debug('[ error ] Camera asking timeout reached ' , 2);
			this.camAccessTimeout();
		}
	};
	this._exit = function(){
		this.debug('[ info ] exiting function', 2);
		this._window.clearTimeout(this._loopInterval);
	};

	// user functions

	this.pause = function(){
		this._options.run = false;
	};
	this.unpause = function(){
		this._options.run = true;
		this._loopInterval = this._window.setTimeout(function(){this._doLoop()}.bind(this), this._options.loopIntervalTime);
	};
	this.isPressed = function(key){
		for (var attr in this._pressedKeys) {  
			
            if(this._pressedKeys[attr] == key){
            	this.debug('[ info ] key pressed test : : \''+ key +'\' is pressed ', 3);
            	return true;
            }
        } 
        this.debug('[ info ] key pressed test : \''+ key +'\' is not pressed', 3);
        return false;
	};
	this.isPressedUni = function(uniCode){
        if(this._pressedKeys[uniCode]){
            this.debug('[ info ] key pressed test : : \''+ this._pressedKeys[uniCode] +'\' is pressed ', 3);
            return true;
        }
        this.debug('[ info ] key pressed test : \''+ key +'\' is not pressed', 3);
        return false;
	};
	this.askForCams = function(){
		if(this._videoAsked == true){return true;}
		var cameraLoaded = false;
		this._camTimeoutInterval = window.setTimeout(function(){this._cameraTimeoutFunction()}.bind(this), this._options.camAccessTimeout * 1000);
		if (navigator.getUserMedia) {
			this.debug('[ info ] get user media compatible, asking for cameras ', 3 );
			for(var i in  this._videoSource){
				navigator.getUserMedia({
												audio: this._options.enableCamAudio,
												video: {
													optional: [{ sourceId : this._videoSource[i][0]}]
												}
											},
											this._gotVideoAccess,
											this._gotVideoAccessError
										   );
		
			}
			this.debug('[ info ] Asking for cameras done', 3 );
			cameraLoaded = true;
    	}
    	this._videoAsked = true;
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
    this.camAccessHandler = function(sources){
    	this.debug('[ warning ] camAccessHandler function is not set and must be (get sources as param)');
    };
    this.camAccessError = function(error){
    	this.debug('[ warning ] camAccessError function is not set and must be (get error name as param)');
    };
    this.camAccessTimeout = function(){
    	this.debug('[ warning ] camAccessTimeout function is not set and must be');
    };
    this.resizeEvent = function(newSize){
    	this.debug('[ warning ] resizeEvent function is not set and must be (get size array as param). The new window size is : ' + newSize[0] +' by '+ newSize[1]);
    };
    this.tweekUp = function(){
		this.debug('[ warning ] function tweekUp is not set and it look like it\'s needed ...');
	};
	this.tweekDown = function(){
		this.debug('[ warning ] function tweekDown is not set and it look like it\'s needed ...');
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
    this._windowListenerR = this._window.addEventListener('resize',function(e) { this._resizeScreen();}.bind(this),false);
    this._setTimeStamp();
    this._setDeltaTime();
    this._setFullScreenSize();

    this._loopInterval = this._window.setTimeout(function(){this._init()}.bind(this), this._options.loopIntervalTime);

	return this;
};