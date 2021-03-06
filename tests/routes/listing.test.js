// Mongoose and mocking requests
const sinon = require('sinon');

const mongoose = require('mongoose')
mongoose.set('debug', true)
require('sinon-mongoose')

// initialize the app and models
const app = require('../../index.js')

// sending requests
const agent = require('supertest').agent(app);
// validating results
const expect = require('chai').expect;

// get the model
const Listing = mongoose.model('Listing')

var Mock = sinon.mock(Listing)

beforeEach(() => {
	Mock.restore(); // Unwraps the spy
	Mock = sinon.mock(Listing)
});

afterEach(() => {
	Mock.verify();
});


describe('Listing Integration tests', () => {

	// Our test data
	const request = {
		"type": "hello",
		"price": "888",
		"fee": "888",
		"active": "true",
		"address": {
			"street": "hello",
			"zipcode": "hello",
			"city": "hello",
			"kommun": "hello",
			"geo": {
				"lat": "4",
				"lng": "4"
			}
		}
	}

	const expected = {
		"type": "hello",
		"price": "888",
		"fee": "888",
		"active": "true",
		"_id": "5cecf112a66bc43a217dfda3",
		"__v": 0,
		"address": {
			"street": "hello",
			"zipcode": "hello",
			"city": "hello",
			"kommun": "hello",
			"geo": {
				"lat": "4",
				"lng": "4"
			}
		}
	}

	describe('listing.get', () => {

		it('Should return an array of all listings', (done) => {

			// Given (preconditions)
			Mock
				.expects('find')
				.chain('exec')
				.resolves([expected]);

			// When (someting happens)
			agent
				.get('/listings')
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(200);
					expect(res.body).to.eql([expected]);
					done();
				});
		});

		it('Should get a listing by price', (done) => {

			// Given (preconditions)
			Mock
				.expects('findOne')
				.withArgs({ price: "888" })
				.chain('exec')
				.resolves(expected);

			// When (someting happens)
			agent
				.get('/listings?price=888')
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(200);
					expect(res.body).to.eql(expected);
					done();
				});
		});
	});

	describe('listing.post', () => {
		it('Should be able to create a listing', (done) => {
			// Given (preconditions)
			Mock
				.expects('create')
				.withArgs(request)
				.chain('exec')
				.resolves(expected);

			// When (someting happens)
			agent
				.post('/listings/')
				.send(request)
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(201);
					expect(res.body).to.eql(expected);
					done();
				});
		});
	})

	describe('listing.put', () => {
		it('Should be able to create a listing', (done) => {
			// Given (preconditions)
			Mock
				.expects('updateOne')
				.withArgs({ _id: "5cecf112a66bc43a217dfda3" }, request)
				.chain('exec')
				.resolves({
					n: 1,
					nModified: 0,
					upserted: [{ index: 0, _id: "5cecf112a66bc43a217dfda3" }],
					ok: 1
				});

			// When (someting happens)
			agent
				.put('/listings/5cecf112a66bc43a217dfda3')
				.send(request)
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(201);
					done();
				});
		});

		it('Should be able to update a listing', (done) => {
			// Given (preconditions)
			Mock
				.expects('updateOne')
				.withArgs({ _id: "5cecf112a66bc43a217dfda3" }, request)
				.chain('exec')
				.resolves({
					n: 1,
					nModified: 1,
					ok: 1
				});

			// When (someting happens)
			agent
				.put('/listings/5cecf112a66bc43a217dfda3')
				.send(request)
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(200);
					done();
				});
		});


		it('Should return 204 when not updating a listing', (done) => {
			// Given (preconditions)
			Mock
				.expects('updateOne')
				.withArgs({ _id: "5cecf112a66bc43a217dfda3" }, request)
				.chain('exec')
				.resolves({
					n: 1,
					nModified: 0,
					ok: 1
				});

			// When (someting happens)
			agent
				.put('/listings/5cecf112a66bc43a217dfda3')
				.send(request)
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(204);
					done();
				});
		});

	});

	describe('listing.deleteById', () => {
		it('Should be able to delete a listing', (done) => {
			// Given (preconditions)
			Mock
				.expects('findByIdAndDelete')
				.withArgs({ _id: "5cecf112a66bc43a217dfda3" })
				.chain('exec')
				.resolves(expected);

			// When (someting happens)
			agent
				.delete('/listings/5cecf112a66bc43a217dfda3')
				.send(request)
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(200);
					expect(res.body).to.eql(expected);
					done();
				});
		});
	});
});
