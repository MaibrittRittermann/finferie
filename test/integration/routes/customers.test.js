const request = require('supertest');
const Customers = require('../../routes/customers');
const { Customer } = require('../../model/customer');
const { User } = require('../../model/user');
const { expectCt } = require('helmet');
let server;

describe('/api/customers', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async() => {
        server.close();
        await Customer.deleteMany({});
    });
    describe('GET /', () => {
        it('should return all customers', async () => {
            Customer.insertMany([
                { name: "name1", phone: "12345678", email: "e@mail.dk", address: "adresse 1", zip: "1234", city: "by" },
                { name: "name2", phone: "23456789", email: "e1@mail.dk", address: "adresse 2", zip: "1234", city: "by" }
            ])
            const res = await request(server).get('/api/customers/');
            expect(res.status).toBe(200);
            expect(res.body.some(c => c.name === 'name1'));
            expect(res.body.some(c => c.name === 'name2'));
        });
    });
    describe('GET /:id', () => {
        it('should return the customer with the given valid ID', async () => {
            const customer = new Customer({name: "name1", phone: "12345678", email: "e@mail.dk", address: "adresse 1", zip: "1234", city: "by" });
            await customer.save();

            const res = await request(server).get('/api/customers/' + customer._id);
            expect(res.status).toBe(200);
            expect(res.body.name === 'name1');
        });
        it('should return 404 when given an invalid ID', async () => {
            const res = await request(server).get('/api/customers/1');
            expect(res.status).toBe(404);
        })
    });
    describe('POST /', () => {
        it('should return 401 if client is not logged in',async () => {
            const res = await request(server)
                .post('/api/customers')
                .send({name: "n", phone: "1", email: "e", address: "a", zip: "1", city: "b" });
            expect(res.status).toBe(401);
        });
        it('should return 400 if customer is invalid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send({name: "n", phone: "1", email: "e", address: "a", zip: "1", city: "b" });
            
            expect(res.status).toBe(400);
        });
        it('should return 400 if customer name is more than 50 chars', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send({name: new Array(51).join('a'), phone: "1", email: "e", address: "a", zip: "1", city: "b" });
            
            expect(res.status).toBe(400);
        });
        it('should create the new valid customer', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/customers/')
                .set('x-auth-token', token)
                .send({name: "name1", phone: "12345678", email: "e@mail.dk", address: "adresse 1", zip: "1234", city: "by" });
            
            const newCustomer = await Customer.find({name: 'name1'});
            expect(newCustomer).not.toBeNull();
        });
        it('should return the new valid customer', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/customers/')
                .set('x-auth-token', token)
                .send({name: "name1", phone: "12345678", email: "e@mail.dk", address: "adresse 1", zip: "1234", city: "by" });
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'name1');
        });
        it('should return 400 if customer is allready created', async () => {
            const token = new User().generateAuthToken();

            const customer = new Customer({name: "name1", phone: "12345678", email: "e@mail.dk", address: "adresse 1", zip: "1234", city: "by" });
            await customer.save();

            const res = await request(server)
                .post('/api/customers/')
                .set('x-auth-token', token)
                .send({name: "name1", phone: "12345678", email: "e@mail.dk", address: "adresse 1", zip: "1234", city: "by" });
            
            expect(res.status).toBe(400);
        });


        
    });
});