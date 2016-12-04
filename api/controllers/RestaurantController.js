
var restaurants = require('../../model/RestaurantData.js');

function getAllRestaurants(req, res) {
    res.json(restaurants.all());
}

function addNewRestaurant(req, res) {
    res.json(restaurants.create(req.body.name, req.body.isSlow, req.body.daysAgo));
}

function getIdFromPath(path) {
    var params = path.split('/');
    return parseInt(params[params.length-1]);
}

function getRestaurant(req, res) {
    var rest = restaurants.get(getIdFromPath(req.path));

    if (rest) {
        res.json(rest);
    } else {
        res.status(404);
        res.json({ message: "Restaurant not found" });
    }
}

function changeRestaurant(req, res) {
    var rest = restaurants.change(getIdFromPath(req.path), req.body.name, req.body.isSlow, req.body.daysAgo);
    if (rest) {
        res.json(rest);
    } else {
        res.status(404);
        res.json({ message: 'Restaurant not found' });
    }
}

function removeRestaurant(req, res) {
    if (restaurants.remove(getIdFromPath(req.path))) {
        res.end();
    } else {
        res.status(404);
        res.json({ message: 'Restaurant not found' });
    }
}


module.exports = {
    getAllRestaurants: getAllRestaurants,
    addNewRestaurant: addNewRestaurant,
    getRestaurant: getRestaurant,
    changeRestaurant: changeRestaurant,
    removeRestaurant: removeRestaurant
};
