(function() {
    const config = {
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
    var query = db.ref('games');

    query.once('value', function(games) {
        const gameList = games.val();

        // Table View
        gameList.forEach((game) => {
            const isOwned = (game.owned ? 'Yes' : 'No');
            const data = [game.title, localization[game.platform].platform, isOwned];
            tblGames.rows.add([data]);
        });
        tblGames.draw();

        // List Views
        loadListView(gameList, BOARD_GAMES);
        loadListView(gameList, SWITCH_GAMES);
        loadListView(gameList, PS4_GAMES);
    });

    $('#btn-list-view').click(() => {
        $('.table-view').hide();
        $('.list-view').show();
        $('#btn-table-view').toggleClass('active', true);
        $('#btn-list-view').toggleClass('active', false);
    });

    $('#btn-table-view').click(() => {
        $('.table-view').show();
        $('.list-view').hide();
        $('#btn-table-view').toggleClass('active', false);
        $('#btn-list-view').toggleClass('active', true);
    });

    $('.nav-item').click(function() {
        $('.nav-item').find('.nav-link').removeClass('active');
        $(this).find('.nav-link').addClass('active');
    });
});

function updateAccordions(categoryId) {
    // Update Category
    $('.btn-check.category-' + categoryId).prop('checked', true);

    // Hide all accordions, then reveal the selected one
    $('.accordion').toggleClass('d-none', true);
    $('.accordion.' + categoryId).toggleClass('d-none', false);
}

function appendToList(games, accordionSelector) {
    [...games].sort((a, b) => a.title.localeCompare(b.title))
        .forEach((game) => {
            const tr = $("<tr></tr>");
            const td = $("<td></td>").text(game.title);
            tr.append(td);

            const table = $(accordionSelector).find('.accordion-body > table');
            table.append(tr);
        });
}

function loadListView(games, categoryId) {
    const categoryGames = games.filter(game => game.platform === categoryId);

    if (categoryGames.length === 0) return;

    const ownedGames = categoryGames.filter((game) => game.owned);
    const wantedGames = categoryGames.filter((game) => !game.owned);

    if (ownedGames.length > 0) {
        const accordionSelector = `.accordion.${categoryId} > .accordion-item.owned`;
        $(accordionSelector).toggleClass('d-none', false);
        appendToList(ownedGames, accordionSelector);
    }

    if (wantedGames.length > 0) {
        const accordionSelector = `.accordion.${categoryId} > .accordion-item.wanted`;
        $(accordionSelector).toggleClass('d-none', false);
        appendToList(wantedGames, accordionSelector);
    }
}