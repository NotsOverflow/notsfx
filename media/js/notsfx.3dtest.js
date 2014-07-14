/*----------------------------------------------------------------------------|
                                                              _____           |
      Autor: Notsgnik                                       /||   /           |
      Email: Labruillere gmail.com                         / ||  /            |
      website: notsgnik.github.io                         /  || /             |
      License: GPL v3                                    /___||/              |
      																		  |
------------------------------------------------------------------------------*/

Math.radian = function(degrees) {
	return degrees * Math.PI / 180;
};

var Point3D = function(){

	this.rotXYZ = function(points, angles){
		points = this.rotX(points, angles[0]);
		points = this.rotY(points, angles[1]);
		points = this.rotZ(points, angles[2]);
		return points;
	};
	this.incAngles = function(angles){
		angles[0] = ( angles[0] + 1 ) % 360 ;
		angles[1] = ( angles[1] + 1 ) % 360 ;
		angles[2] = ( angles[2] + 1 ) % 360 ;
		return angles;	
	};
	this.incAnglesXY = function(angles){
		angles[0] = (angles[0] + 1) % 360 ;
		angles[1] = (angles[1] + 1) % 360 ;
		return angles;	
	};
	this.rotX = function(points,angle){
		var rad   =	Math.radian(angle);
		var cosa  =	Math.cos(rad);
		var sina  = Math.sin(rad);
		var y = points[1] * cosa - points[2] * sina;
		var z = points[1] * sina + points[2] * cosa;
		return [points[0], y, z];
	};
	this.rotY = function(points,angle){
		var rad   =	Math.radian(angle);
		var cosa  =	Math.cos(rad);
		var sina  = Math.sin(rad);
		var z = points[2] * cosa - points[0] * sina;
		var x = points[2] * sina + points[0] * cosa;
		return [x, points[1], z];		
	};
	this.rotZ = function(points,angle){
		var rad   =	Math.radian(angle);
		var cosa  =	Math.cos(rad);
		var sina  = Math.sin(rad);
		var x = points[0] * cosa - points[1] * sina;
		var y = points[0] * sina + points[1] * cosa;
		return [x, y, points[2]];		
	};

	this.project2D = function(points, width, height, fov, view_distance){
		var factor = fov / (view_distance + points[2])
		var x = points[0] * factor + width / 2
		var y = -points[1] * factor + height / 2
        return [x, y, points[2]];
	};
	return this;
};