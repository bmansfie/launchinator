
var parse = require('csv-parse/lib/sync');
var fs = require('fs');
var path = require('path');

var raw = fs.readFileSync(path.join(__dirname, '../restaurants.csv')).toString();
var rests = parse(raw);

var data = [];

for (var i = 1; i < rests.length; i++) {
    data.push({
        id: parseInt(rests[i][0]),
        name: rests[i][1]
    });
}

/*
var data = [
  { "id": 1, "name": "Costa Vida" },
  { "id": 2, "name": "Jimmy John's" },
  { "id": 3, "name": "Buffalo Wild Wings" },
  { "id": 4, "name": "Chick-Fil-A" },
  { "id": 5, "name": "Cafe Rio" },
  { "id": 6, "name": "Arby's" },
  { "id": 7, "name": "Marco's Pizza" },
  { "id": 8, "name": "Firehouse Subs" },
  { "id": 9, "name": "Habit Burger" },
  { "id": 10, "name": "Popeye's" },
  { "id": 11, "name": "Taco Time" },
  { "id": 12, "name": "Panda Express" },
  { "id": 13, "name": "Rock Creek Pizza Company" },
  { "id": 14, "name": "Astro Burger" },
  { "id": 15, "name": "Cafe Zupas" },
  { "id": 16, "name": "DP Cheesesteak" },
  { "id": 17, "name": "In-n-Out Burger" },
  { "id": 18, "name": "Kneaders" },
  { "id": 19, "name": "Goodwood Barbecue Company" },
  { "id": 20, "name": "Five Guys" }
];
*/

function findId() {
    var id = Math.floor(Math.random()*10000);
    // checks for a unique id, otherwise it regenerates it
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            id = Math.floor(Math.random()*10000);
            i = -1;
        }
    }
    return id;
}

function all() {
    return data;
}

function create(name, isSlow, daysAgo) {
    var rest = {
        id: findId(),
        name: name,
        isSlow: isSlow,
        daysAgo: daysAgo
    };
    data.push(rest);
    return rest;
}

function get(id) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            return data[i];
        }
    }
}

function change(id, name, isSlow, daysAgo) {
    var rest = get(id);
    if (rest) {
        rest.name = name;
        rest.isSlow = isSlow;
        rest.daysAgo = daysAgo;
    }
    return rest;
}

function remove(id) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            data.splice(i, 1);
            return true;
        }
    }
    return false;
}

function getBallot() {
    var ballot = [];
    var slowTotal = 0;

    while (ballot.length < 5 && ballot.length < data.length) {
        var candidate = data[Math.floor(Math.random()*data.length)];
        var found = false;
        for (var i = 0; i < ballot.length; i++) {
            if (candidate.id === ballot[i].id) {
                found = true;
            }
        }
        // the logic !(candidate.daysAgo < 5) must pass when undefined, that
        // is why it is defined this way with a not.
        // in the absense of data we assume it hasn't been picked in a while
        if (!found && !(candidate.daysAgo < 5) && slowTotal < 2) {
            ballot.push(candidate);
            if (candidate.isSlow)
                slowTotal++;
        }
    }
    return ballot;
}

function pick(name) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == name) {
            data[i].daysAgo = 0;
        }
    }
}

function ageOneDay() {
    for (var i = 0; i < data.length; i++) {
        if (typeof data[i].daysAgo !== 'undefined') {
            data[i].daysAgo++;
        }
    }
}

module.exports = {
    all: all,
    create: create,
    get: get,
    change: change,
    remove: remove,
    getBallot: getBallot,
    pick: pick,
    ageOneDay: ageOneDay
}
