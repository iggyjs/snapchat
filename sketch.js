/* Transitions states so show different filterss
 *	0 = Rainbow mouth
 *	1 = Moustache
 *	...
 */
var states = [0, 1, 2, 3, 4, 5];

// Initial state
var state = 0;
var snowflakes = [];

var WIDTH, HEIGHT;
var capture;
var eyeImage;
var rainbowImage, rainbowSound;
var moustacheImage, flake;
var rainbows = [];

var facePoints = {
	'faceOutline'  : {'closed':false, points: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]},  
	'leftEye'      : {'closed':true,  points: [23,63,24,64,25,65,26,66]},
	'rightEye'     : {'closed':true,  points: [30,68,29,67,28,70,31,69]},
	'leftEyebrow'  : {'closed':false, points: [19,20,21,22]},
	'rightEyebrow' : {'closed':false, points: [18,17,16,15]},
	'noseBridge'   : {'closed':false, points: [33,41,62]},
	'nose'         : {'closed':false, points: [34,35,36,42,37,43,38,39,40]},
	'upperLip'     : {'closed':true,  points: [44,45,46,47,48,49,50,59,60,61]},
	'lowerLip'     : {'closed':true,  points: [44,55,54,53,52,51,50,58,57,56]}	
};


function preload() {

	WIDTH = window.innerWidth * 0.8;
	HEIGHT = (3 * WIDTH)/4;

	//state 0 
	eyeImage = loadImage("googly_eye.png");
	rainbowImage = loadImage("rainbow.jpg");
	flake = loadImage("assets/images/flake.svg");

	// UNCOMMENT
	// rainbowSound = loadSound("assets/sounds/rainbow_sound.mp3");

	//state 1
	moustacheImage = loadImage("moustache.png");

	//...
}

function windowResized() {
	WIDTH = window.innerWidth * 0.8;
	HEIGHT = (3 * WIDTH)/4;

	$("#toolbar").css("margin-top", HEIGHT*0.8+ 'px');
	$("#renderCanvas").hide();
  	resizeCanvas(WIDTH, HEIGHT-100);
}

function setup() {
	// State 1
	// rainbowSound.setVolume(0.1);

	// size our canvas
	createCanvas(WIDTH, HEIGHT-100);

	// create a video capture object
	capture = createCapture(VIDEO);
	capture.size(WIDTH, HEIGHT);
	capture.hide();
	startTrackerFromProcessing(capture);

	noiseDetail(24);

	  for (var i = 0; i < 100; i++) {
	    snowflakes.push(new Snowflake(0, WIDTH));
	  }
}

function draw() {
  	tint(255);
	background(255);
	imageMode(CORNER);
	image(capture, 0, 0, WIDTH, HEIGHT);
	
	var faceArray = getFaceArray();
	
	if (faceArray != false){
		if (state == 1) {
			var eyeSize = dist(faceArray[23][0], faceArray[23][1], faceArray[25][0], faceArray[25][1]) * 2; 		
		
			imageMode(CENTER);
			image(eyeImage, faceArray[27][0], faceArray[27][1], eyeSize, eyeSize);
			image(eyeImage, faceArray[32][0], faceArray[32][1], eyeSize, eyeSize);
			
			
			var lipDistance = dist(faceArray[47][0], faceArray[47][1], faceArray[53][0], faceArray[53][1]);
			var openDistance = dist(faceArray[60][0], faceArray[60][1], faceArray[57][0], faceArray[57][1]);
			var mouthWidth = dist(faceArray[44][0], faceArray[44][1], faceArray[50][0], faceArray[50][1]);
			
			
			if (openDistance/lipDistance > 0.5){
				var tempRainBow = new Rainbow(faceArray[57][0], faceArray[57][1], mouthWidth, openDistance);
			
				rainbows.push(tempRainBow);
				// UNCOMMENT
				// rainbowSound.play();
			}

			else { //mouth isn't open
				// UNCOMMENT
				// rainbowSound.stop();
			}

			for (var i = 0; i < rainbows.length; i++){
				var offScreen = rainbows[i].display();
				// remove reaiboz
				if (offScreen){
					rainbows.splice(i, 1);
				}
			}
		}

		if (state == 2){ //moustache
			// draws moustache between botttom of nose and upperlip
	    	var upperLipNoseDistance = dist(faceArray[37][0], faceArray[37][1], faceArray[47][0], faceArray[47][1]);
	    	var mouthWidth = dist(faceArray[44][0], faceArray[44][1], faceArray[50][0], faceArray[50][1]);
			image(moustacheImage, faceArray[37][0], faceArray[37][1], mouthWidth, upperLipNoseDistance);		
		}

		if (state ==3){
			for (var i = 0; i < snowflakes.length; i++) {
			    snowflakes[i].display();
			    snowflakes[i].move();
			}
		}

		if (state ==4){
			stroke(255,255,255);
			ellipse(faceArray[27][0], faceArray[27][1], 5, 5);
			ellipse(faceArray[32][0], faceArray[32][1], 5, 5);

			var keys = ["rightEye", "leftEye", "leftEyebrow", "rightEyebrow", "nose"];
			
			for (var i=0; i<keys.length; i++){
				var key = keys[i];
				var group = facePoints[key]['points'].length;
				
				for (var j = 0; j < group-1; j++){	
					line(faceArray[facePoints[key]['points'][j]][0], faceArray[facePoints[key]['points'][j]][1], faceArray[ facePoints[key]['points'][j+1] ][0], faceArray[ facePoints[key]['points'][j+1] ][1]);					
				}
				
				if (facePoints[key]['closed']){
					line(faceArray[ facePoints[key]['points'][ group-1 ] ][0], faceArray[ facePoints[key]['points'][ group-1 ] ][1], faceArray[ facePoints[key]['points'][0] ][0], faceArray[ facePoints[key]['points'][0] ][1]);
				}

			}

			line(faceArray[27][0], faceArray[27][1],faceArray[32][0], faceArray[32][1]);
			var d = dist(faceArray[27][0], faceArray[27][1], faceArray[32][0], faceArray[32][1]);
			d /= 2;
			line(faceArray[27][0]+d, faceArray[27][1],faceArray[facePoints['lowerLip']['points'][3]][0], faceArray[facePoints['lowerLip']['points'][3]][1])

			line(faceArray[facePoints['leftEyebrow']['points'][0]][0], faceArray[facePoints['leftEyebrow']['points'][0]][1],faceArray[facePoints['lowerLip']['points'][3]][0], faceArray[facePoints['lowerLip']['points'][3]][1])

			var lastPointRightEyebrow = facePoints['rightEyebrow']['points'].length - 1;

			line(faceArray[facePoints['rightEyebrow']['points'][lastPointRightEyebrow]][0], faceArray[facePoints['rightEyebrow']['points'][lastPointRightEyebrow]][1],faceArray[facePoints['lowerLip']['points'][3]][0], faceArray[facePoints['lowerLip']['points'][3]][1])

			var group = facePoints['lowerLip']['points'].length;
			
			for (var j = 0; j < group-1; j++){	
				line(faceArray[facePoints['lowerLip']['points'][j]][0], faceArray[facePoints['lowerLip']['points'][j]][1], faceArray[ facePoints['lowerLip']['points'][j+1] ][0], faceArray[ facePoints['lowerLip']['points'][j+1] ][1]);					
			}
			
			if (facePoints['lowerLip']['closed']){
				line(faceArray[ facePoints['lowerLip']['points'][ group-1 ] ][0], faceArray[ facePoints['lowerLip']['points'][ group-1 ] ][1], faceArray[ facePoints['lowerLip']['points'][0] ][0], faceArray[ facePoints['lowerLip']['points'][0] ][1]);
			}
		}
	}

}


function takePicture() {
  // grabs all pixels from canvas
  var picturePixels = get(0, 0, WIDTH, HEIGHT);
  var randomID = Math.floor((Math.random() * 1000) + 1);
  // saves picture and names it with an ID
  save(picturePixels, 'snapchat_clone_' + randomID + '.png');
  
}

//State 1 Class
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

//State 3 Classe(s)

function Snowflake(x, xMax) {
  this.asset = flake;
  this.x = random(x, xMax);
  this.y = random(-250, 0);
  this.angle = 0;
  this.xOffset = random(0, 3);
  this.ySpeed = random(1,2);

  this.display = function() {

    push();

    translate(this.x, this.y);
    rotate(radians(this.angle));
    imageMode(CENTER);
    image(this.asset, 0, 0, 10, 10);

    pop();

    this.angle += 1;
  }

  this.move = function() {
    var xNoise = map(noise(this.xOffset), 0, 1, -1, 1);
    
    this.x += xNoise;
    this.y += this.ySpeed;

    this.xOffset += 0.01;

    if (this.y > HEIGHT) {
      this.x = random(x, xMax);
      this.y = random(-10, 0);
    }
  }

}