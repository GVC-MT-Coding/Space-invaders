// Firebase database variable
var database;
// Path variable
var ref;
var test;
function firebase_config() {
    var config = {
	apiKey: "AIzaSyD74eTQbyV3I7t4iOlXOpQBoRoPOWkJJpE",
	authDomain: "space-invaders-b656f.firebaseapp.com",
	databaseURL: "https://space-invaders-b656f.firebaseio.com",
	projectId: "space-invaders-b656f",
	storageBucket: "space-invaders-b656f.appspot.com",
	messagingSenderId: "153481888393"
    };

    firebase.initializeApp(config);

    // Firebase database
    database = firebase.database();
    // Assign ref as path to the scores node of the database
    ref = database.ref('scoreboard');

    // On update of values from firebase, call gotData
    ref.on('value', gotData, errData);

}

// On update of values from firebase, set scores_data = raw
function gotData(data) {
    scores = data.val();
    scoreboard_fn();
}

function errData(err) {
    console.log('Error! ' + err);
}
