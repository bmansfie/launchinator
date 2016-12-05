
var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var validVoteId;

describe('controllers', function () {
    describe('BallotController', function () {
        describe('GET /api/ballot', function () {
            it('Should fail on failure to authenticate', function (done) {
                request(server)
                    .get('/api/ballot')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });

            it('Get the ballot list', function (done) {
                request(server)
                    .get('/api/ballot')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);

                        res.body.should.be.Array();
                        res.body.length.should.be.exactly(5);
                        for (var i = 0; i < res.body.length; i++) {
                            for (var j = 0; j < res.body.length; j++) {
                                (i != j && res.body[i].id === res.body[j].id).should.be.exactly(false);
                            }
                        }
                        validVoteId = res.body[0].id;
                        done();
                    });
            });
        });
        describe('POST /api/vote', function () {
            it('Should fail on failure to authenticate', function (done) {
                request(server)
                    .post('/api/vote')
                    .set('Accept', 'application/json')
                    .query({ id: validVoteId })
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            /* This test is bugged, only works properly after 11:45
             * it('Vote for a valid id before extending the voting time', function (done) {
                request(server)
                    .post('/api/vote')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .query({ id: validVoteId })
                    .expect('Content-Type', /json/)
                    .expect(409)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: 'Vote time expired' });
                        done();
                    });
            }); */
            it('Vote for a invalid id', function (done) {
                request(server)
                    .post('/api/vote')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .query({ id: -5 })
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: 'Vote attempted is not on the ballot' });
                        done();
                    });
            });
        });
        describe('POST /api/voting-closes', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .post('/api/voting-closes')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            it('Set vote closing time to complete in one minute', function (done) {
                request(server)
                    .post('/api/voting-closes')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .query({ time: new Date().getHours() * 100 + new Date().getMinutes() + 1 })
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });
        describe('POST /api/vote follow up', function () {
            it('Vote for a valid id', function (done) {
                request(server)
                    .post('/api/vote')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .query({ id: validVoteId })
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });
        describe('POST /api/winner', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .post('/api/winner')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            it('Winner!', function (done) {
                request(server)
                    .post('/api/winner')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.name.should.be.String();
                        done();
                    });
            });
        });
        describe('POST /api/tomorrow', function () {
            it('should fail on failure to authenticate', function (done) {
                request(server)
                    .post('/api/tomorrow')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "Forbidden" });
                        done();
                    });
            });
            it('Reset voting to tomorrow', function (done) {
                request(server)
                    .post('/api/tomorrow')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });
        describe('POST /api/winner follow up', function () {
            it('No winner found', function (done) {
                request(server)
                    .post('/api/winner')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.eql({ message: "No winner found, try voting first." });
                        done();
                    });
            });
        });
    });
});
