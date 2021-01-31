const request = require('supertest');
const { User } = require('../../model/user');
let server;

describe('/api/users', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await User.deleteMany({});
    });
    describe('GET /', () => {
        it('should return all users', async () => {
            User.insertMany([
                {name:'name', email:'e@mail.com', password:'12345'},
                {name:'name1', email:'e1@mail.com', password:'12345'}
            ]);
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
            expect(res.body.some(u => u.name === 'name')).toBeTruthy();
            expect(res.body.some(u => u.name === 'name1')).toBeTruthy();
        });
    });
    describe('GET /id', () => {
        it('should return the user with the given ID', async () => {
            const user = new User({name:'name', email:'e@mail.com', password:'12345'},)
            await user.save();
                
            const res = await request(server).get('/api/users/'+ user._id);
            expect(res.status).toBe(200);
            expect(res.body.name === 'name').toBeTruthy();
        });
        it('should return 404 if given an invalid id', async () => {
            const res = await request(server).get('/api/users/1');
            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        it('should create a new user when given valid input', async () => {
            const user = new User({name:'name', email:'e@mail.com', password:'12345'},)
            await user.save();
                
            const res = await request(server).get('/api/users/'+ user._id);
            expect(res.status).toBe(200);
            expect(res.body.name === 'name').toBeTruthy();
        });

    });
});