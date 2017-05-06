// Scores JSON file as scores
var scores_array = [];
// Scores text
var scores_text = "";
// Leaderboard size
var leaderboard_size = 10;

function scoreboard_fn() {
    scores_array = [];
    // Convert JSON data into an array in the format [[user, score]]
    for(var x in scores) {
	scores_array.push([scores[x].fb_user, scores[x].fb_score]);
    }
    // Sort the array in descending order of scores
    scores_array.sort(function(a, b) {
	return b[1] - a[1];
    });

    // Put the scores into formatted string
    scores_text = "";
    for(var i = 0; i < scores_array.length && i < leaderboard_size; i++) {
	scores_text +=  "\nRANK " + String(i+1) + ": " + String(scores_array[i][0]) + " - " + String(scores_array[i][1]) + " pts";
    }

}

function scoreboard_draw() {
    textSize(20);
    textAlign(LEFT);
    fill(255,255,255);
    text(scores_text , width / 2 - 120, 100);

    textSize(40);
    textAlign(CENTER);
    fill(255,255,255);
    text("LEADERBOARD", width / 2, 80);
    textSize(20);
    text("Press ENTER to return to main menu", width / 2, height - 20);

}
