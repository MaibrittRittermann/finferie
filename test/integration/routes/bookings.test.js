const { Booking } = require('../../../model/booking');
const { User } = require('../../../model/user');
const request = require('supertest');
const mongoose = require('mongoose');
const { Appartment } = require('../../../model/appartment');
const { Customer } = require('../../../model/customer');
let server;

describe('/api/booking/', () => {

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async () => {
        server.close();
        await Booking.deleteMany({});
    });

    describe('GET /', () => {
        it('should return 401 if user is not authorized', async () => {
            const res = await request(server)
            .get('/api/bookings/')
            expect(res.status).toBe(401);
        });
        it('should return all bookings if authorized', async () => {
            const token = new User({isAdmin:true}).generateAuthToken();
            await Booking.insertMany([
                {                    
                    appartment: {_id: new mongoose.Types.ObjectId(),name: 'a'},
                    customer: {_id: new mongoose.Types.ObjectId()},
                    dateFrom: new Date(),
                    dateTo: new Date,
                    price: 1200
                },
                {
                    appartment: {_id: new mongoose.Types.ObjectId(),name: 'a'},
                    customer: {_id: new mongoose.Types.ObjectId()},
                    dateFrom: new Date(),
                    dateTo: new Date,
                    price: 1200
                }
            ]);
            const res = await request(server)
                .get('/api/bookings/')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
        });
    });
    describe('GET /:id', () => {
        it('should return 401 if user is not authorized', async () => {
            const booking = new Booking({                    
                appartment: {_id: new mongoose.Types.ObjectId(),name: 'a'},
                customer: {_id: new mongoose.Types.ObjectId()},
                dateFrom: new Date(),
                dateTo: new Date,
                price: 1200
            });
            await booking.save(); 

            const res = await request(server)
                .get('/api/bookings/' + booking._id);
            
                expect(res.status).toBe(401);
        });
        it('should return 404 if given invalid ObjectId', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .get('/api/bookings/1')
                .set('x-auth-token', token);
            
                expect(res.status).toBe(404);
        });
        it('should return the booking with the given ID when authorized', async () => {
            const token = new User().generateAuthToken();
            const booking = new Booking({                    
                appartment: {_id: new mongoose.Types.ObjectId(),name: 'a'},
                customer: {_id: new mongoose.Types.ObjectId()},
                dateFrom: new Date(),
                dateTo: new Date,
                price: 1200
            });
            await booking.save(); 

            const res = await request(server)
                .get('/api/bookings/' + booking._id)
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
        });
    });

    describe('POST /', () => {
        it('should return 400 if booking overlaps existing booking', async () => { 

            const appartment = new Appartment({
                name: 'a12345',
                excerpt: 'a123456789',
                description: 'a123456789',
                address: 'a',
                city: 'a',
                zip: 1234,
            });
            await appartment.save();

            const customer = new Customer({
                name: '12345',
                phone: '12345678',
                email: 'a@b.com',
                address: '12345678',
                zip: '1234',
                city: 'by'
            });
            await customer.save();

            const booking = new Booking({                    
                appartment: {_id: appartment._id, name: appartment.name},
                customer: {_id: new mongoose.Types.ObjectId()},
                dateFrom: new Date(2021, 8, 7),
                dateTo: new Date(2021, 8, 10),
                price: 1200
            });
            await booking.save();

            const res = await request(server).post('/api/bookings/')
                .send({                    
                    appartment: appartment._id,
                    customer: customer._id,
                    tennents: [{name: 'Jens Jensen', age: 46}, {name: 'Liv Jensen', age: 46}],
                    dateFrom: new Date(2021, 8, 7).toJSON(),
                    dateTo: new Date(2021, 8, 14).toJSON(),
                    price: 1200
                });
            expect(res.status).toBe(400);
        });
 

        it('should create a new Booking with the given info', async () => {

            const appartment = new Appartment({
                name: 'a12345',
                excerpt: 'a123456789',
                description: 'a123456789',
                address: 'a',
                city: 'a',
                zip: 1234,
            });
            await appartment.save();
            const customer = new Customer({
                name: '12345',
                phone: '12345678',
                email: 'a@b.com',
                address: '12345678',
                zip: '1234',
                city: 'by'
            });
            await customer.save();
            const res = await request(server).post('/api/bookings/')
                .send({                    
                    appartment: appartment._id,
                    customer: customer._id,
                    tennents: [{name: 'Jens Jensen', age: 46}, {name: 'Liv Jensen', age: 46}],
                    dateFrom: new Date(2021, 2, 7).toJSON(),
                    dateTo: new Date(2021, 2, 14).toJSON(),
                    price: 1200
                });
            expect(res.status).toBe(200);
        });
    });
});