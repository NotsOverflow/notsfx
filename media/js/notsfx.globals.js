/*----------------------------------------------------------------------------|
                                                              _____           |
      Autor: Notsgnik                                       /||   /           |
      Email: Labruillere gmail.com                         / ||  /            |
      website: notsgnik.github.io                         /  || /             |
      License: GPL v3                                    /___||/              |
      																		  |
------------------------------------------------------------------------------*/
/* global function and vars

	navigator.getUserMedia
	documentReady(function) // jquery like
	documentClose(function) // jquery like

*/

navigator.getUserMedia = (navigator.getUserMedia || 
                          navigator.webkitGetUserMedia || 
                          navigator.mozGetUserMedia || 
                          navigator.msGetUserMedia);

function documentReady(someFunction){
	if(window.attachEvent) {
		window.attachEvent('onload', someFunction);
	} else {
		if(window.onload) {
		    var curronload = window.onload;
		    var newonload = function() {
		        curronload();
		        someFunction();
		    };
		    window.onload = newonload;
		} else {
		    window.onload = someFunction;
		}
	}

}

function documentClose(someFunction){
	if(window.onbeforeunload) {
		var curronload = window.onbeforeunload;
		var newonload = function() {
			curronload();
			someFunction();
		};
		window.onbeforeunload = newonload;
	} else {
		window.onbeforeunload = someFunction;
	}
}

function mergeObj(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { 
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) { 
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function deleteCookie(cname) {
	document.cookie = cname+"=false; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function getCookie(cname) {
	var name =  cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return false;
}

function getElemStyle(el,styleProp){
	if (el.currentStyle){
	    return el.currentStyle[styleProp];
	}
	return document.defaultView.getComputedStyle(el,null)[styleProp];
}
