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
	var nfx = Nfx({mediaElement : 'body', verbosity : 2, noTweek : true, targetFps : 70});
	window.nfx = nfx;
	nfx.debug('[ info ] Using Nfx !');

	

	nfx.init = function(){
		this.p3D = Point3D();
		this.mediaElement.innerHTML = '<canvas id="myCanvas" onmousemove="javascript:window.nfx.mouseMove(event);" onmouseout="javascript:window.nfx.mouseUp();" onmouseup="javascript:window.nfx.mouseUp();" onmousedown="javascript:window.nfx.mouseDown();" width="'+ this.resolution[0]+'" height="'+ this.resolution[1] +'" style="border:1px solid #999999;background-color:#000000"></canvas>';
		this.vertices = [
			[-1,1,-1],
			[1,1,-1],
			[1,-1,-1],
			[-1,-1,-1],
			[-1,1,1],
			[1,1,1],
			[1,-1,1],
			[-1,-1,1]
		];
		this.angles = [0,0,0];
		this.mouseIsDown = false;
		this.mousePos = false;
		this.prevMousePos = false;
		this.mouseUp = function(){ this.mouseIsDown = false; this.mousePos = false;this.prevMousePos = false; this.debug("mouseUp",3);};
		this.mouseDown = function(){ this.mouseIsDown = true; this.debug("mouseDown",3);};
		this.mouseMove = function(e){
			if(this.mouseIsDown == true){	
				this.prevMousePos = this.mousePos;
				this.mousePos = [];
				var rect = this.c.getBoundingClientRect();
				this.mousePos[0] = e.clientX - rect.left;
		        this.mousePos[1] = e.clientY - rect.top;
			}
		};
		
		this.pause();
	};
	nfx.beforeStart = function(){
		this.c = document.getElementById("myCanvas");
		this.ctx = this.c.getContext("2d");
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.font = "10px Arial";
		this.fpsPos = [this.resolution[0] - 50,this.resolution[1] - 20];
		this.unpause();
	};
	nfx.run = function(){
		
		// FPS count
		if((new Date().getTime() - someTimeStamp) >= 999){
			someTimeStamp = new Date().getTime();
			someFPS = someCount;
			someCount = 0;
		}
		someCount = someCount + 1 ;

		// Display 

		this.ctx.clearRect(0, 0, this.resolution[0], this.resolution[1]);
		ctx.fillText(someFPS + " fps",this.fpsPos[0],this.fpsPos[1]);
		var r,p,x,y;
		for(var v in this.vertices){
			r = this.p3D.rotXYZ(this.vertices[v],this.angles);
			p = this.p3D.project2D(r,this.resolution[0], this.resolution[1], 256, 4);
			this.ctx.fillRect(parseInt(p[0]),parseInt(p[1]),1,1);
		}

		// Pressed keys or mouse mouvement
		if(this.mouseIsDown == true 
		&& this.mousePos != false
		&& this.prevMousePos != false){
			var x = this.prevMousePos[0] - this.mousePos[0];
			var y = this.prevMousePos[1] - this.mousePos[1];
			this.angles = [(this.angles[0] - x) % 360, (this.angles[1] - y) % 360 , this.angles[2]];
		}
		else{
			var pressedKeyMove = false;
			if(this.isPressed("UP")){
				this.angles[0] = (this.angles[0] + 1) % 360;
				pressedKeyMove = true;
			}
			if(this.isPressed("DOWN")){
				this.angles[0] = (this.angles[0] - 1) % 360;
				pressedKeyMove = true;
			}
			if(this.isPressed("LEFT")){
				this.angles[1] = (this.angles[1] - 1) % 360;
			}
			if(this.isPressed("RIGHT")){
				this.angles[1] = (this.angles[1] + 1) % 360;
				pressedKeyMove = true;
			}
			if(pressedKeyMove == false){
				this.angles = this.p3D.incAngles(this.angles);
			}
		}
		
		return true;
	};
});