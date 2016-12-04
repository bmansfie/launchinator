var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var nomId;

describe('controllers', function () {
    describe('RestaurantController', function () {
        describe('GET /api/restaurants', function () {
            it('should fail on failure to authenticate', function (done) {

                request(server)
                    .get('/api/restaurants')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });

            it('Get the stock restaurant list', function (done) {

                request(server)
                    .get('/api/restaurants')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);

                        res.body.should.eql([
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
                        ]);
                        done();
                    });
            });
        });
            
        describe('POST /api/restaurants', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .post('/api/restaurants')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });

            it('Add a restaurant', function (done) {
                request(server)
                    .post('/api/restaurants')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .send({
                        id: 0,
                        name: 'nom noms',
                        isSlow: true,
                        daysAgo: 3
                    })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.name.should.eql('nom noms');
                        res.body.isSlow.should.eql(true);
                        res.body.daysAgo.should.eql(3);
                        res.body.id.should.be.a.Number();
                        nomId = res.body.id;
                        done();
                    });
            });
            
            it('Get the extra restaurant list', function (done) {
                request(server)
                    .get('/api/restaurants')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);

                        res.body[20].name.should.eql('nom noms');
                        res.body[20].isSlow.should.eql(true);
                        res.body[20].daysAgo.should.eql(3);
                        res.body[20].id.should.be.a.Number();
                        done();
                    });
            });
        });
        describe('DELETE /api/restaurants/{id}', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .delete('/api/restaurants/16')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            it('Delete id 16', function (done) {
                request(server)
                    .delete('/api/restaurants/16')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql( {} );
                        done();
                    });
            });
            it('Delete id 16 should fail because it no longer exists', function (done) {
                request(server)
                    .delete('/api/restaurants/16')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Restaurant not found" });
                        done();
                    });
            });
        });
        describe('GET /api/restaurants/{id}', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .get('/api/restaurants/' + nomId)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            it('GET using nom noms id', function (done) {
                request(server)
                    .get('/api/restaurants/' + nomId)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.name.should.eql('nom noms');
                        res.body.isSlow.should.eql(true);
                        res.body.daysAgo.should.eql(3);
                        res.body.id.should.be.a.Number();
                        done();
                    });
            });
            it('Get id -50 should fail because it cannot exist', function (done) {
                request(server)
                    .get('/api/restaurants/-50')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Restaurant not found" });
                        done();
                    });
            });
        });
        describe('POST /api/restaurants/{id}', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .post('/api/restaurants/' + nomId)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            it('POST using nom noms id', function (done) {
                request(server)
                    .post('/api/restaurants/' + nomId)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .send({
                        id: 0,
                        name: 'nom noms!!',
                        isSlow: false,
                        daysAgo: 4
                    })
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.name.should.eql('nom noms!!');
                        res.body.isSlow.should.eql(false);
                        res.body.daysAgo.should.eql(4);
                        res.body.id.should.be.a.Number();
                        done();
                    });
            });
            it('Post id -50 should fail because it cannot exist', function (done) {
                request(server)
                    .post('/api/restaurants/-50')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .send({
                        id: 0,
                        name: 'nom noms!!',
                        isSlow: false,
                        daysAgo: 4
                    })
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Restaurant not found" });
                        done();
                    });
            });
        });
    });
});
