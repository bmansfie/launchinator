var parse = require('csv-parse/lib/sync');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var auth = require('basic-auth');

var raw = fs.readFileSync(path.join(__dirname, '../users.csv')).toString();
var userName = parse(raw);

var users = [];

var adminList = ['amber', 'brian', 'carl', 'david', 'username'];

for (var i = 0; i < userName.length; i++) {
    users.push({
        name: userName[i].toString(),
        isAdmin: _.contains(adminList, userName[i].toString())
    });
}

function isValidUser(user, pass) {
    for (var i = 0; i < users.length; i++) {
        if (user == users[i].name)
            return users[i];
    }
    return undefined;
}

function isAdmin(user, pass) {
    var userVal = isValidUser(user);
    if (userVal) {
        return userVal.isAdmin;
    } else {
        return false;
    }
}

function middle(req, res, next) {
    if (req.url.indexOf('/swagger') >= 0) {
        next();
    } else {
        var user = auth(req);
        if (user) {
            if (!isValidUser(user.name) || (req.url.indexOf('/api/restaurant') >= 0 && !isAdmin(user.name))) {
                res.status(403);
                res.json({ message: 'Forbidden' });
            } else {
                //console.log('approved ' + JSON.stringify(user) + ' to access ' + req.url);
                req.user = user.name;
                next();
            }
        } else {
            res.status(403);
            res.json({ message: 'Forbidden' });
        }
    }
}

module.exports = {
    expressMiddleware: middle
}

