/*
	WebPlotDigitizer - http://arohatgi.info/WebPlotDigitizer

	Copyright 2010-2013 Ankit Rohatgi <ankitrohatgi@hotmail.com>

	This file is part of WebPlotDigitizer.

    WebPlotDigitizer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebPlotDigitizer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebPlotDigitizer.  If not, see <http://www.gnu.org/licenses/>.


*/


/* Selected Data Variables */
var xyData = new Array(); // Raw data
var pointsPicked = 0; // number of data points picked.

/**
 * Called when the 'acquire data' button is pressed. 
 */
function acquireData() {
	if(axesPicked === 0) {
		showPopup('alignAxes');
	} else {
		showSidebar('manualMode');
		removeAllMouseEvents();
	}
}

/**
 * Initiate Manual data acquisition. Enables data capture on the canvas.
 */ 
function pickPoints() {// select data points.

	if (axesPicked === 0) {
		alert('Define the axes first!');
	} else {
		removeAllMouseEvents();
		addMouseEvent('click',clickPoints,true);
		//pointsPicked = 0;
		//xyData = [];
		pointsStatus(pointsPicked);
		//redrawCanvas();
		showSidebar('manualMode');
	}
}

/**
 * Triggered by clicking on canvas, stores position in xyData global array.
 */
function clickPoints(ev) {
	var posn = getPosition(ev);
	var xi = posn.x;
	var yi = posn.y;

	xyData[pointsPicked] = new Array();
	xyData[pointsPicked][0] = parseFloat(xi);
	xyData[pointsPicked][1] = parseFloat(yi);
	pointsPicked = pointsPicked + 1;	

	dataCtx.beginPath();
	dataCtx.fillStyle = "rgb(200,0,0)";
	dataCtx.arc(xi,yi,3,0,2.0*Math.PI,true);
	dataCtx.fill();

	pointsStatus(pointsPicked);
	updateZoom(ev);

}

/**
 * Called when 'clear all' is hit. Clears data collected, redraws canvas. 
 */
function clearPoints() {// clear all markings.

	pointsPicked = 0;
	pointsStatus(pointsPicked);
    resetLayers();
	
	removeAllMouseEvents();
}

/**
 * Deletes the last point picked.
 */
function undoPointSelection() {
	if (pointsPicked >= 1) {
		pointsPicked = pointsPicked - 1;
		pointsStatus(pointsPicked);
		
        resetLayers();

		for(ii = 0; ii < pointsPicked; ii++) {
			xi = xyData[ii][0];	
			yi = xyData[ii][1];

			dataCtx.beginPath();
			dataCtx.fillStyle = "rgb(200,0,0)";
			dataCtx.arc(xi,yi,3,0,2.0*Math.PI,true);
			dataCtx.fill();
		}

	}
}

/**
 * Updates the displayed number of points on the sidebar.
 */
function pointsStatus(pn) {// displays the number of points picked.

	var points = document.getElementById('pointsStatus');
	var autoPoints = document.getElementById('autoPointsStatus');
	points.innerHTML = pn;
	autoPoints.innerHTML = pn;
}

/**
 * Delete specific point close to clicked position.
 */
function deleteSpecificPoint() {

	removeAllMouseEvents();
	addMouseEvent('click',deleteSpecificPointHandler,true);
}

/**
 * Handle clicks when in specific point deletion mode
 */
function deleteSpecificPointHandler(ev) {

	var posn = getPosition(ev);
	var xi = parseFloat(posn.x);
	var yi = parseFloat(posn.y);
	
	var minDistance = 10.0;
	var foundPoint = 0;
	var foundIndex = 0;

	for (var ii = 0; ii < pointsPicked; ii ++) {
		var xd = parseFloat(xyData[ii][0]);
		var yd = parseFloat(xyData[ii][1]);
		var distance = Math.sqrt((xd-xi)*(xd-xi) + (yd-yi)*(yd-yi));

		if (distance < minDistance) {
			foundPoint = 1;
			foundIndex = ii;
			minDistance = distance;
		}
	}

	if (foundPoint === 1) {
		xyData.splice(foundIndex,1);

		pointsPicked = pointsPicked - 1;
		pointsStatus(pointsPicked);
			
        resetLayers();

		for(ii = 0; ii < pointsPicked; ii++) {
			xp = xyData[ii][0];	
			yp = xyData[ii][1];
			dataCtx.beginPath();
			dataCtx.fillStyle = "rgb(200,0,0)";
			dataCtx.arc(xp,yp,3,0,2.0*Math.PI,true);
			dataCtx.fill();
		}
	}

	updateZoom(ev);

}
