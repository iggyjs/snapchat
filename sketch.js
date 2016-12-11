var WIDTH = $(window).width() * 0.65;
var HEIGHT = WIDTH * 0.75;
// our video capture object
var capture;

// artwork
var eyeImage;
var rainbowImage;

// an array for our rainbows
var rainbows = [];

function preload() {
  // load in our googly eye graphic
  eyeImage = loadImage("googly_eye.png");

  // load in our rainbow image
  rainbowImage = loadImage("rainbow.jpg");
}

function setup() {
	// size our canvas
	createCanvas(WIDTH, HEIGHT);

	// create a video capture object
	capture = createCapture(VIDEO);
	capture.size(WIDTH, HEIGHT);

	// prevent the capture from being displayed (we will
	// choose to display it using the image() function in
	// our draw loop
	capture.hide();
  
	// tell the face tracker to start looking at our capture 
	// object to find a face in the incoming video stream
	startTrackerFromProcessing(capture);
}

function draw() {
  tint(255);
	background(255);
	imageMode(CORNER);
	image(capture, 0, 0, WIDTH, HEIGHT);
	
	// get face array
	var faceArray = getFaceArray();
	
	// do we see a face?
	if (faceArray != false)
	{
		// now draw it! the vertices in the face array describe features
		// of the face.  A full map of these vertices can be found here:
		// https://github.com/auduno/clmtrackr
		
		// each element of the faceArray contains two sub-elements - the x
		// position and the y position

		// compute the distance between the eyes
		var eyeSize = dist(faceArray[23][0], faceArray[23][1], faceArray[25][0], faceArray[25][1]) * 2; 		
		
		// draw pupils
		imageMode(CENTER);
		image(eyeImage, faceArray[27][0], faceArray[27][1], eyeSize, eyeSize);
		image(eyeImage, faceArray[32][0], faceArray[32][1], eyeSize, eyeSize);
		
		
		
		// compute the distance between the top of the upper lip and the bottom of lower lip
		var lipDistance = dist(faceArray[47][0], faceArray[47][1], faceArray[53][0], faceArray[53][1]);

		// compute the distance between the lips (mouth opening)
		var openDistance = dist(faceArray[60][0], faceArray[60][1], faceArray[57][0], faceArray[57][1]);
		
		
		console.log("Lip distance: " + lipDistance + "; Open distance: " + openDistance);
		
		// compute the distance between the edges of the mouth
		var mouthWidth = dist(faceArray[44][0], faceArray[44][1], faceArray[50][0], faceArray[50][1]);
		
		// does the mouth opening take up at least 25% of this space?
		if (openDistance/lipDistance > 0.4)
		{
			// create a rainbow object
			var temp = new Rainbow(faceArray[57][0], faceArray[57][1], mouthWidth, openDistance);
			
			// put this rainbow object into our rainbows array
			rainbows.push( temp );
		}		
	}
	
	// draw all rainbows
	for (var i = 0; i < rainbows.length; i++)
	{
		// display the rainbow and ask it if it is off the screen
		var offScreen = rainbows[i].display();
		
		// if it is off the screen remove it from the array
		if (offScreen)
		{
			rainbows.splice(i, 1);
		}
	}
}


// our rainbow object
function Rainbow(x, y, w, h) {

	// everything this rainbow needs to know about itself (instance variables)
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.alpha = 0;
	
	// display function to draw the rainbow to the screen
	// also reports back when the rainbow goes off screen
	this.display = function() {
	  tint(255,this.alpha);
		image(rainbowImage, this.x, this.y, this.width, this.height);
		this.alpha += 5;
		this.alpha = constrain(this.alpha, 0, 255);
		this.y += 2;
		
		if (this.y > height)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

