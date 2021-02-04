const request = require('supertest');
const { Appartment } = require('../../../model/appartment');
const { User } = require('../../../model/user');
let server;

describe('/api/appartments', () => {

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async () => {
        server.close();
        await Appartment.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all Appartments', async () => {
            await Appartment.insertMany([
                {
                    name: '12345', 
                    excerpt:'1234567890', 
                    description: '1234567890',
                    address: 'a',
                    zip: '1234',
                    city: 'b'
                },
                {
                    name: '123456', 
                    excerpt:'12345678901', 
                    description: '12345678901',
                    address: 'a',
                    zip: '1234',
                    city: 'b'
                }
            ]);

            const res = await request(server).get('/api/appartments');
            expect(res.status).toBe(200);
            expect(res.body.some(a => a.name === '12345')).toBeTruthy();
            expect(res.body.some(a => a.name === '123456')).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('should return the appartment with the given ID', async () => {
            const appartment = new Appartment({
                name: '12345', 
                excerpt:'1234567890', 
                description: '1234567890',
                address: 'a',
                zip: '1234',
                city: 'b'
            });
            await appartment.save();
            const res = await request(server).get('/api/appartments/' + appartment._id);
            expect(res.status).toBe(200);
            expect(res.body.name === '12345').toBeTruthy();
        });
        it('should return 404 if given invalid ID', async () => {
            const res = await request(server).get('/api/appartments/1');
            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        it('should return 401 if user is not logged in', async () => {
            const res = await request(server).post('/api/appartments/').send(
                {
                    name: '12345', 
                    excerpt:'1234567890', 
                    description: '1234567890',
                    address: 'a',
                    zip: '1234',
                    city: 'b'
                }
            );
            expect(res.status).toBe(401);
        });
        it('should return 400 if given invalid data', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/appartments/')
                .set('x-auth-token', token)
                .send(
                    {
                        name: '1', 
                        excerpt:'1234567890', 
                        description: '1234567890',
                        address: 'a',
                        zip: '1234',
                        city: 'b'
                    }
                );
            expect(res.status).toBe(400);
        });
        it('should create a new appartment with the given info', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/appartments/')
                .set('x-auth-token', token)
                .send(
                    {
                        name: '12345', 
                        excerpt:'1234567890', 
                        description: '1234567890',
                        address: 'a',
                        zip: '1234',
                        city: 'b'
                    }
                );
            expect(res.status).toBe(200);
            const appartment = Appartment.find({name: '12345'});
            expect(appartment).not.toBeNull();
        });
    });
    describe('PUT /', () => {
        it('should return 404 if given invalid objectID', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).put('/api/appartments/1')
                .set('x-auth-token', token);
            expect(res.status).toBe(404);
        });
        it('should return 401 if user is not logged in', async () => {
            const appartment = new Appartment({
                name: '12345', 
                excerpt:'1234567890', 
                description: '1234567890',
                address: 'a',
                zip: '1234',
                city: 'b'
            });
            await appartment.save();

            const res = await request(server).put('/api/appartments/' + appartment._id).send(
                {
                    name: '12345', 
                    excerpt:'Dette er et uddrag', 
                    description: '1234567890',
                    address: 'a',
                    zip: '1234',
                    city: 'b'
                }
            );
            expect(res.status).toBe(401);
        });
        it('should return 400 if given invalid data', async () => {
            const appartment = new Appartment({
                name: '12345', 
                excerpt:'1234567890', 
                description: '1234567890',
                address: 'a',
                zip: '1234',
                city: 'b'
            });
            await appartment.save();

            const res = await request(server).put('/api/appartments/' + appartment._id).send(
                {
                    name: '12345', 
                    excerpt:'Dette er et uddrag', 
                    description: '1234567890',
                    address: 'a',
                    zip: '1234',
                    city: 'b'
                }
            );
            expect(res.status).toBe(401);
        });


    });
    describe('DELETE /', () => {
        it('should delete movie if it exist and user is authorized', async () => {            
            const token = new User().generateAuthToken();
            const appartment = new Appartment({
                name: '12345', 
                excerpt:'1234567890', 
                description: '1234567890',
                address: 'a',
                zip: '1234',
                city: 'b'
            });
            await appartment.save();

            await request(server).del('/api/appartments/' + appartment._id)
                .set('x-auth-token', token);
                
            const result = await Appartment.findById(appartment.id);
            expect(result).toBeNull();
        });
    });
});