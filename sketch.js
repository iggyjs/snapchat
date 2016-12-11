/* Transitions states so show different filterss
 *	0 = Rainbow mouth
 *	1 = Moustache
 *	...
 */
var states = [0, 1, 2, 3, 4, 5];

// Initial state
var state = 0;

var WIDTH, HEIGHT;
var capture;
var eyeImage;
var rainbowImage, rainbowSound;
var moustacheImage;
var rainbows = [];


function preload() {

	WIDTH = window.innerWidth* 0.8;
	if ((3*WIDTH)/4 < 761) {
		HEIGHT = (3*WIDTH) /4;
	}
	else {
		HEIGHT = 761;
	}

	//state 0 
	eyeImage = loadImage("googly_eye.png");
	rainbowImage = loadImage("rainbow.jpg");

	// UNCOMMENT
	// rainbowSound = loadSound("assets/sounds/rainbow_sound.mp3");

	//state 1
	moustacheImage = loadImage("moustache.png");

	//...
}

function windowResized() {

	WIDTH = window.innerWidth* 0.8;
	if ((3*WIDTH)/4 < 761) {
		HEIGHT = (3*WIDTH) /4
	}
	else {
		$("canvas").css("margin-top", 0);    
		HEIGHT = 761;
	}

	$("#renderCanvas").hide();
  	resizeCanvas(WIDTH, HEIGHT);
}

function setup() {
	// State 1
	// rainbowSound.setVolume(0.1);

	// size our canvas
	createCanvas(WIDTH, HEIGHT);

	// create a video capture object
	capture = createCapture(VIDEO);
	capture.size(WIDTH, HEIGHT);
	capture.hide();
	startTrackerFromProcessing(capture);
}

function draw() {
  	tint(255);
	background(255);
	imageMode(CORNER);
	image(capture, 0, 0, WIDTH, HEIGHT);
	
	var faceArray = getFaceArray();
	
	if (faceArray != false){
		if (state == 0) {
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
			
			// compute the distance between the edges of the mouth
			var mouthWidth = dist(faceArray[44][0], faceArray[44][1], faceArray[50][0], faceArray[50][1]);
			
			

			// does the mouth opening take up at least 25% of this space?
			if (openDistance/lipDistance > 0.4){
				// create a rainbow object
				var temp = new Rainbow(faceArray[57][0], faceArray[57][1], mouthWidth, openDistance);
				
				// put this rainbow object into our rainbows array
				rainbows.push(temp);
				// UNCOMMENT
				// rainbowSound.play();
			}

			else { //mouth isn't open
				// UNCOMMENT
				// rainbowSound.stop();
			}

			// draw all rainbows
			for (var i = 0; i < rainbows.length; i++){
				// display the rainbow and ask it if it is off the screen
				var offScreen = rainbows[i].display();
				
				// if it is off the screen remove it from the array
				if (offScreen)
				{
					rainbows.splice(i, 1);
				}
			}
		}

		if (state == 1){ //moustache
			// draws moustache between botttom of nose and upperlip
	    	var upperLipNoseDistance = dist(faceArray[37][0], faceArray[37][1], faceArray[47][0], faceArray[47][1]);
	    	var mouthWidth = dist(faceArray[44][0], faceArray[44][1], faceArray[50][0], faceArray[50][1]);
			image(moustacheImage, faceArray[37][0], faceArray[37][1], mouthWidth, upperLipNoseDistance);		
		}
	}

}


//State 1 Classes
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

//State 2 Classes