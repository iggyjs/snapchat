/* 
   clmtracker API for p5.js

   Written by Craig Kapp (kapp [at] cs [dot] nyu [dot] edu)
              November 24th, 2015

   Based on clmtracker:  https://github.com/auduno/clmtrackr
   Based on p5.js: http://p5js.org
   
   Usage: 
   
   * Construct a standard video capture object in p5.js
   * Call 'startTrackerFromProcessing()' and pass it a reference to your capture object
   * In 'draw()', call 'getFaceArray()' - it will return false if no face is present, or
     a multidimensional array of integers that represent the geometry of the face.  i.e.
     
     faceArray[0][0], facearray[0][1] is the x,y position for face feature 0
     
   * A full description of these points and what they represent can be found here:
     https://github.com/auduno/clmtrackr
          
   Seek sketch.js for detailed usage information
*/

// video & tracker objects
var vid;
var ctrack;
  	
// assume the face hasn't been found
var faceFound = false;
var facePosition;

function startTrackerFromProcessing(theVideo)
{
	// store a reference to our video
	vid = theVideo.elt;
	
	// create our tracker to find our faces
	ctrack = new clm.tracker({useWebGL : true});
	ctrack.init(pModel);
	ctrack.start(vid);
	
	// call our drawLoop function which will continually run
	// to detect faces in the incoming video stream
	drawLoop();
}

function drawLoop() {
	// this will re-call this function when a new frame of video is available
	requestAnimFrame(drawLoop);

	// do we see a face?  if so, make a note of its position and set our flag!
	if (ctrack.getCurrentPosition()) 
	{
		faceFound = true;
		facePosition = ctrack.getCurrentPosition();
	}
	else
	{
		faceFound = false;
	}
}
	
function getFaceArray() 
{
	if (faceFound) {
		return facePosition;
	}
	else {
		return false;
	}
}