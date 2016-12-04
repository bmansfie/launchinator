
var restaurants = require('../../model/RestaurantData.js');
var qs = require('qs');
var twit = require('twit');

var T = new twit({
    consumer_key: '4aIvMZ52zptbZczr98cjxTXVo',
    consumer_secret: 'S4mGnHj5nztZaHKVsc7vvKH9283UYkQjqUndXonOmmVZIo17Id',
    access_token: '805140101147684865-T1Cw0UsuX3N5ftkCTTZhA3pTnQ3OH6c',
    access_token_secret: 'aQSq4ofzWBGxHFuxSqz1B7z5bjHXHkrpLyGV6KKOq1iDP',
    timeout_ms: 60*1000
});

var ballot = restaurants.getBallot();

function shuffle(array) {
    for (var i = 0; i < array.length; i++) {
        var random = Math.floor(Math.random()*i);
        var temp = array[i];
        array[i] = array[random];
        array[random] = temp;
    }
    return array;
}

function getBallot(req, res) {
    ballot = shuffle(ballot);
    res.json(ballot);
}

var votes = {};
var closingTime = new Date();
closingTime.setHours(11);
closingTime.setMinutes(45);

function castVote(req, res) {
    var found = false;
    req.query = qs.parse(req.query);
    for (var i = 0; i < ballot.length; i++) {
        if (req.query.id == ballot[i].id) {
            found = true;
        }
    }
    if (found) {
        if (new Date() > closingTime) {
            res.status(409);
            res.json({ message: 'Vote time expired' });
        } else {
            votes[req.user] = req.query.id;
            console.log(JSON.stringify(votes));
            res.end();
        }
    } else {
        res.status(404);
        res.json({ message: 'Vote attempted is not on the ballot' });
    }
}

// this flag is only used for when we send out tweets.
var startVoting = true;

function closeVoteAt(req, res) {
    startVoting = true;
    closingTime.setHours(req.query.time / 100);
    closingTime.setMinutes(req.query.time % 100);
    res.end();
}

function tomorrowReset(req, res) {
    ballot = restaurants.getBallot();
    restaurants.ageOneDay();
    closingTime = new Date();
    votes = {};
    res.end();
}

function getWinner() {
    var voteTotals = {};
    for (user in votes) {
        var id = votes[user];
        voteTotals[id] = voteTotals[id] ? voteTotals[id]+1 : 1;
    }
    var winner = null;
    var max = 0;
    for (id in voteTotals) {
        if (voteTotals[id] > max) {
            winner = id;
            max = voteTotals[id];
        }
    }
    for (var i = 0; i < ballot.length; i++) {
        if (ballot[i].id == winner) {
            return { name: ballot[i].name };
        }
    }
    return false;
}

function winner(req, res) {
    var winner = getWinner();
    if (winner) {
        res.json(winner);
    } else {
        res.status(404);
        res.json({ message: 'No winner found, try voting first.' });
    }
}

// This function sets up it's own call back, it will run once per minute
// We run it here (once only!) to start the process
checkForWinner();
function checkForWinner() {
    if (startVoting && new Date() > closingTime) {
        var winner = getWinner();
        startVoting = false;
        if (winner) {
            //T.post('statuses/update', { status: 'Where to for lunch? ' + winner.name + '!' });
            console.log('Where to for lunch? ' + winner.name + '!');
            restaurants.pick(winner.name);
        } else {
            //T.post('statuses/update', { status: 'Good luck with lunch today' });
            console.log('Good luck with lunch today');
        }
    }
    setTimeout(checkForWinner, 60000);
}

module.exports = {
    getBallot: getBallot,
    castVote: castVote,
    closeVoteAt: closeVoteAt,
    tomorrowReset: tomorrowReset,
    winner: winner
}