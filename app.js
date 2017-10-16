(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCvOUqQPRbo7rJPtunQnV23jjfN3v73Ee4",
    authDomain: "iwantthesegames-a724e.firebaseapp.com",
    databaseURL: "https://iwantthesegames-a724e.firebaseio.com",
    storageBucket: "iwantthesegames-a724e.appspot.com"
  };
  firebase.initializeApp(config);
}());

$(document).ready(function() {

    // Default: Show board-games; hide others
    update('board-games');

    var db = firebase.database();

    loadBoardGameData(db.ref('games/wantedBoardGames'), 'wantedBoardGames');
    loadBoardGameData(db.ref('games/ownedBoardGames'), 'ownedBoardGames');
    loadVideoGameData(db.ref('games/wantedPs4Games'), 'wantedPs4Games');
    loadVideoGameData(db.ref('games/ownedPs4Games'), 'ownedPs4Games');
    loadVideoGameData(db.ref('games/wantedSwitchGames'), 'wantedSwitchGames');
    loadVideoGameData(db.ref('games/ownedSwitchGames'), 'ownedSwitchGames');

    $(".accordion").click(function() {
        $(this).toggleClass("active");

        /* Toggle between hiding and showing the active panel */
        var panel = $(this).next();
        if (panel.css("display") === "table") {
            panel.hide();
        } else {
            panel.css("display", "table");
        }
    });
});

function addNewBoardGame(tableID, game) {
    var table = $("#" + tableID);
    var tr = $("<tr></tr>");
    
    // Title
    var td = $("<td></td>").text(game.title);
    tr.append(td);

    // NumPlayers
    td = $("<td></td>").text(game.numPlayers);
    tr.append(td);

    // Duration
    td = $("<td></td>").text(game.duration);
    tr.append(td);

    table.append(tr);
}

function addNewVideoGame(tableID, game) {
    var table = $("#" + tableID);
    var tr = $("<tr></tr>");
    
    // Title
    var td = $("<td></td>").text(game.title);
    tr.append(td);

    table.append(tr);
}

function update(categoryID) {
    if (categoryID === "board-games") {
        $('.board-games').show();
        $('.ps4-games').hide();
        $('.switch-games').hide();
        $("#header").text("I want these board games");
    } else if (categoryID === "ps4-games") {
        $('.board-games').hide();
        $('.switch-games').hide();
        $('.ps4-games').show();
        $("#header").text("I want these PS4 games");
    } else if (categoryID === "switch-games") {
        $('.board-games').hide();
        $('.ps4-games').hide();
        $('.switch-games').show();
        if (ownedSwitchGames.length === 0) {
            $('.owned.switch-games').hide();
        }
        $("#header").text("I want these Switch games");
    }
}

function loadBoardGameData(ref, table) {
    ref.once('value', function(games) {
        games.forEach(function(game) {
            addNewBoardGame(table, game.val());
        })
    });
}

function loadVideoGameData(ref, table) {
    ref.once('value', function(games) {
        games.forEach(function(game) {
            addNewVideoGame(table, game.val());
        })
    });
}