// Open in browser: https://space-invaders-b656f.firebaseapp.com/ or shortened link https://goo.gl/35jbpS
// Also use Ctrl-F5 to refresh in chrome to remove cached data to allow javascript code update

// Scores JSON file variable name
var scores;
// input variable for username
var input;
// in order to prevent infinite creation of input box
var input_draw = true;
// Space ship object
var ss;
// Array of bullets
var bullets = [];
// Array of enemies
var enemies = [];


var score = 0;
var highscore = 0;
// Sound variables
var sound_laser, sound_explosion, sound_menu, sound_gameover;
// Image variables
var img_space, img_ss;

function preload() {
    // Call firebase config
    firebase_config();

    // Load Sounds
    sound_laser = loadSound("sounds/Laser.mp3");
    sound_explosion = loadSound("sounds/Explosion.mp3");
    sound_menu = loadSound("sounds/menu.mp3");
    sound_gameover = loadSound("sounds/gameover.wav");

    // Load Images
    img_space = loadImage("images/space.jpg");
    img_ss = loadImage("images/spaceship.png");
}

function setup() {


    createCanvas(600,400);
    
    // Call scoreboard function to precalculate scores
    scoreboard_fn();
    
    // Create spacehip object
    ss = new ss_class();
    // Create 10 enemies
    for(i=0; i<10; i++) {
	var colour = [random(255), random(255), random(255)];
	enemies.push(new enemy_class(random(width),0 , colour));
    }
}


function draw() {
    background(0);
    // Keep the screen focused(?)
    canvas.focus();

    // For some reason, sometimes scores_array isn't calculated properly. So we force calculate until it works
    if(scores_array.length === 0) {
	scoreboard_fn();
    }
    
    // If game start
    if(start) {
	// Space invaders title
	textSize(80);
	textAlign(CENTER);
	fill(255,255,255);
	text("SPACE\nINVADERS", width / 2, height / 2 - 50);

	// Press Space to begin
	textSize(20);
	textAlign(CENTER);
	fill(255,255,255);
	text("Press ENTER to begin", width / 2, height / 2 + 100);

	textSize(15);
	textAlign(LEFT);
	fill(255,255,255);
	text("\nPress ESC to see scoreboard", 30, 20);

    }


    
    // If play mode
    if(play) {
	// Display space background
	image(img_space, 0, 0);
	// Display and update bullets
	for(i = bullets.length - 1; i >= 0; i--) {
	    bullets[i].display();
	    bullets[i].update();
	    // Remove bullets off screen
	    if(bullets[i].y < 0) {
		bullets.splice(i, 1);
	    }
	}

	// Display and update spaceship
	ss.display();
	ss.update();

	
	for(i = enemies.length - 1; i >= 0; i--) {
	    // Display and update enemies
	    enemies[i].display();
	    enemies[i].update();
	    
	    // If enemies and spaceship collide or enemies get past the screen, gameover
	    if(dist(enemies[i].x, enemies[i].y, ss.x, ss.y) < enemies[i].rad + ss.rad || enemies[i].y > height - enemies[i].rad) {
		sound_gameover.setVolume(0.1);
		sound_gameover.play();
		play = false;
		if(score >= scores_array[min(scores_array.length - 1, leaderboard_size - 1)][1]) {
		    un = true;
		} else {
		    go = true;
		}
		break;
	    }

	    // Collision detection between bullets and enemies
	    for(j = bullets.length - 1; j >= 0; j--) {
		if(dist(enemies[i].x, enemies[i].y, bullets[j].x, bullets[j].y) < enemies[i].rad + bullets[j].rad) {
		    // Play explosion sound
		    sound_explosion.setVolume(0.1);
		    sound_explosion.play();

		    // Remove the bullet
		    bullets.splice(j, 1);
		    
		    // Move the enemy to the top of the screen
		    enemies[i].x = random(width);
		    enemies[i].y = -2 * enemies[i].rad;
		    // Create another enemy with 10% probability
		    if(random(10) < 1) {
			var colour = [random(255), random(255), random(255)];
			enemies.push(new enemy_class(random(width),-2 * enemies[i].rad, colour));
		    }
		    // Increase score by 10
		    score += 10;
		    break;
		}
	    }
	}

    }

    // If game over, show gameover message
    if(go) {
	textSize(40);
	textAlign(CENTER);
	fill(255,255,255);
	text("GAME OVER!\nPRESS ENTER TO RESTART", width / 2, height / 2);
    }

    if(un) {
	textSize(60);
	textAlign(CENTER);
	fill(255,255,255);
	text("Congratulations!", width / 2, 100);
	textSize(30);
	textAlign(LEFT);
	text("You made it onto the scoreboard.", 100, 200);
	textSize(30);
	text("TYPE NAME:", 100, 250);
	textAlign(CENTER);
	text("Then press ENTER to submit", width / 2, 350);

	noFill();
	// Create input box if input_draw = true so that it creates only once
	if(input_draw) {
	    // Defines inputbox(requires p5.dom)
	    input = createInput();
	    input.position(320, 228);
	    input_draw = false;
	}
	// Focuses on the inputbox
	input.elt.focus();
    }
    
    // If scoreboard mode, draw scores
    if(sb) {
	scoreboard_draw();
    }

    
    
    // If paused, show pause message
    if(pause) {
	textSize(20);
	textAlign(CENTER);
	fill(100,100,100);
	text("GAME PAUSED\nPRESS ENTER TO RESUME", width / 2, height / 2);
    }

    
    // Calculate highscore
    if(score >= highscore)
	highscore = score;
    
    // Display score and highscore
    textSize(15);
    textAlign(RIGHT);
    fill(255,255,255);
    text("Current Score: " + score + "\nSession highscore: " + highscore, width -30 , 20);


}

// Spaceship class
function ss_class(){
    this.w = img_ss.width / 12;
    this.h = img_ss.height / 12;
    this.rad = 25;
    this.x = width / 2;
    this.y = height - this.h / 2;
    this.vel = 10;

    this.display = function() {
	noStroke();
	fill(0,0,255);
	image(img_ss, this.x - this.w / 2, this.y - this.h / 2, this.h, this.w);

    };
    this.update = function() {
	if(!pause) {
	    if(keyIsDown(LEFT_ARROW) && this.x > this.rad) {
		this.x -= this.vel;
	    }
	    if(keyIsDown(RIGHT_ARROW) && this.x < width - this.rad) {
		this.x += this.vel;
	    }
	}
    };
}

function bullets_class(x, y) {
    this.rad = 5;
    this.x = x;
    this.y = y;
    this.vel = 20;

    this.display = function() {
	noStroke();
	fill(random(255),random(255),random(255));
	ellipse(this.x, this.y, 2 * this.rad, 2 * this.rad);
    };
    this.update = function() {
	if(!pause) {
	    this.y -= this.vel;
	}
    };
}

function enemy_class(x, y, colour) {
    this.rad = 20;
    this.x = x;
    this.y = y;
    this.vel = 0.5;

    this.display = function() {
	stroke(255);
	strokeWeight(4);
	fill(colour[0], colour[1], colour[2]);
	ellipse(this.x, this.y, 2 * this.rad, 2 * this.rad);
	noStroke();
    };
    this.update = function() {
	if(!pause) {
	    this.y += this.vel;
	}
    };
}
