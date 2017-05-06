// Start?
var start = true;
// Play?
var play = false;
// Pause?
var pause = false;
// Gameover?
var go = false;
// Scoreboard mode
var sb = false;
// Username input
var un = false;

function reset_play() {
    enemies = [];
    bullets = [];
    setup();
}

function keyReleased() {
    // When Enter pressed at start menu, set start = false and go to main game
    if(keyCode == 13 && start) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	start = false;
	play = true;
    }
    // When Enter pressed at gameover screen, go to scoreboard screen
    else if(keyCode == 13 && go) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	go = false;
	sb = true;
    }

    else if(keyCode == 13 && un) {
	sound_menu.setVolume(0.1);
	sound_menu.play();

	// assign inputtextbox's value as user
	var user = input.value();
	// Temporarily add new data to temporary memory. Sometimes the upload and download to and from firebase is too slow for it to be ready before scoreboard calculation
	scores[scores.length] = {fb_user: user, fb_score:score};
	// Push new score to firebase
	ref.push({fb_user:user, fb_score:score});
	// Recalculate scoreboard
	scoreboard_fn();
	// Set un false and sb true
	un = false;
	sb = true;
	// Remove input box
	input.remove();
	// Allow input draw to be made
	input_draw = true;
    }
    

    // When Enter pressed at scoreboard screen, go to start menu
    else if(keyCode == 13 && sb) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	// Call scoreboard function to recalculate the highscores
	scoreboard_fn();
	reset_play();
	sb = false;
	start = true;
	score = 0;
    }
    // When Enter pressed during the play  and not paused, pause the game
    else if(keyCode == 13 && play && !pause) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	pause = true;
    }
    // When Enter pressed during the game and paused, resume the game
    else if(keyCode == 13 && pause) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	pause = false;
    }
    
    // When Space pressed during the game, shoot bullets
    if(keyCode == 32 && play && !pause) {
	sound_laser.setVolume(0.1);
	sound_laser.play();

	bullets.push(new bullets_class(ss.x, ss.y));
    }
    // When ESC pressed during the game, go to start
    if(keyCode == 27 && !start && !un) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	reset_play();
	go = false;
	pause = false;
	sb = false;
	play = false;
	start = true;
	score = 0;
    }

    // When ESC pressed during the start, go to highscore board
    else if(keyCode == 27 && start) {
	sound_menu.setVolume(0.1);
	sound_menu.play();
	start = false;
	sb = true;
	score = 0;
    }

}
