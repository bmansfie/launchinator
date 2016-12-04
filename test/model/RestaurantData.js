
var should = require('should');
var request = require('supertest');
var restaurants = require('../../model/RestaurantData');

describe('models', function () {
    describe('RestaurantData', function () {
        describe('change()', function () {
            it('valid', function (done) {
                restaurants.change(2, 'This is a new name', true, 4);
                restaurants.get(2).should.eql({
                    id: 2,
                    name: 'This is a new name',
                    isSlow: true,
                    daysAgo: 4
                });
                done();
            });
            it('invalid', function (done) {
                (typeof restaurants.change(-3, 'This is a new name', true, 4) === 'undefined').should.equal(true);
                done();
            });
        });
        describe('remove()', function () {
            it('valid', function (done) {
                restaurants.remove(2).should.equal(true);
                done();
            });
            it('invalid', function (done) {
                restaurants.remove(-2).should.equal(false);
                done();
            });
        });
        it('create()', function (done) {
            var newItem = restaurants.create('yumyum', false, 3);
            newItem.id.should.be.a.Number();
            newItem.name.should.be.eql('yumyum');
            newItem.isSlow.should.be.equal(false);
            newItem.daysAgo.should.be.exactly(3);
            done();
        });
        it('getBallot()', function (done) {
            var ballot = restaurants.getBallot();
            ballot.length.should.equal(5);
            // uniqueness test
            for (var i = 0; i < ballot.length; i++) {
                for (var j = 0; j < ballot.length; j++) {
                    (i != j && ballot[i].id === ballot[j].id).should.be.exactly(false);
                }
            }
            done();
        });
        it('pick()', function (done) {
            restaurants.pick(restaurants.get(3).name);
            restaurants.get(3).daysAgo.should.be.exactly(0);
            done();
        });
        it('ageOneDay()', function (done) {
            restaurants.ageOneDay();
            restaurants.get(3).daysAgo.should.be.exactly(1);
            done();
        });
    });
});