(function() {
  var config = {
    apiKey: "AIzaSyCvOUqQPRbo7rJPtunQnV23jjfN3v73Ee4",
    authDomain: "iwantthesegames-a724e.firebaseapp.com",
    databaseURL: "https://iwantthesegames-a724e.firebaseio.com",
    storageBucket: "iwantthesegames-a724e.appspot.com"
  };
  firebase.initializeApp(config);
}());

const BOARD_GAMES = 'board-games';
const SWITCH_GAMES = 'switch-games';
const PS4_GAMES = 'ps4-games'

var activeCategory = BOARD_GAMES;

const localization = {
    'board-games': {
        platform: 'Board Game',
        header: 'I want these board games'
    },
    'switch-games': {
        platform: 'Nintendo Switch',
        header: 'I want these Switch games'
    },
    'ps4-games': {
        platform: 'PS4',
        header: 'I want these PS4 games'
    }
}

$(document).ready(function() {

    var tblGames = $('#tbl-games').DataTable({
        columnDefs: [
            { width: '80%', targets: 0 },
            { width: '20%', targets: 1 },
            { width: '10%', targets: 2 }
        ]
    });

    var db = firebase.database();
    var query = db.ref('games/v2games');
    query.once('value', function(games) {
        const gameList = games.val();

        // Table View
        gameList.forEach((game) => {
            const isOwned = (!!game.owned ? 'Yes' : 'No');
            const data = [game.title, localization[game.platform].platform, isOwned];
            tblGames.rows.add([data]).draw();
        });

        // List Views
        loadListView(gameList, BOARD_GAMES);
        loadListView(gameList, SWITCH_GAMES);
        loadListView(gameList, PS4_GAMES);
    });

    $('#btn-v1').click(() => {
        updateAccordions(activeCategory);

        $('.table-view').hide();
        $('.list-view').show();
        $('#btn-v1').toggleClass('active', true);
        $('#btn-v2').toggleClass('active', false);
    });

    $('#btn-v2').click(() => {
        $('.table-view').show();
        $('.list-view').hide();
        $('#btn-v1').toggleClass('active', false);
        $('#btn-v2').toggleClass('active', true);
        $('#header').text('I want these games');
    });

    $('.nav-item').click(function() {
        $('.nav-item').find('.nav-link').removeClass('active');
        $(this).find('.nav-link').addClass('active');
    });

    $(".accordion").click(function() {
        $(this).toggleClass("active");

        const isActive = $(this).hasClass('active');
        var panel = $(this).next();
        panel.toggleClass('active', isActive);
    });
});

function updateAccordions(categoryId) {
    activeCategory = categoryId;
    $('.game-category').toggleClass('active', false);
    $('.category-' + categoryId).addClass('active');
    $('.game-accordion').hide();
    $('.' + categoryId).show();
    $('#header').text(localization[categoryId].header);
}

function loadListView(games, categoryId) {
    games.filter(game => game.platform === categoryId)
        .sort((a, b) => a.title.localeCompare(b.title))
        .forEach((game) => {
            const tr = $("<tr></tr>");
            const td = $("<td></td>").text(game.title);
            tr.append(td);

            if (game.owned) {
                $('.owned.' + categoryId + ' table').append(tr);
            } else {
                $('.wanted.' + categoryId + ' table').append(tr);
            }
        });
}