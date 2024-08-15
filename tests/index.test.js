const request = require('supertest');
const { app } = require('../src/index');
const sequelize = require('../src/database/config');
const { User, Event } = require('../models/index');
require('dotenv').config();
const moment = require('moment');

let testUserId;
let testUserEmail;
const testUserPassword = 'password123';
let testEventId;
let token;
let server;
const PORT = 3001;

beforeAll(async () => {
    server = app.listen(PORT);
    await sequelize.authenticate();
});

afterAll(async () => {
    if (testUserId) {
        await User.destroy({ where: { id: testUserId } });
    }

    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
});

describe('POST /auth/register', () => {
    it('should register a new user', async () => {
        const newUser = {
            name: 'John Doe',
            email: `test${Date.now()}@example.com`,
            password: testUserPassword,
            confirmPassword: testUserPassword,
            profile_picture: 'http://example.com/johndoe.jpg'
        };

        const response = await request(app)
            .post('/auth/register')
            .send(newUser);

        console.log('Response Body:', response.body);
        expect(response.status).toBe(201);

        const user = await User.findOne({ where: { email: newUser.email } });
        expect(user).not.toBeNull();
        expect(user.name).toBe(newUser.name);

        testUserId = user.id;
        testUserEmail = user.email;
    });
});

describe('POST /auth/login', () => {
    it('should login a user', async () => {
        const logingUser = {
            email: testUserEmail,
            password: testUserPassword
        }

        const response = await request(app)
            .post('/auth/login')
            .send(logingUser);

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');

        token = response.body.token;
    });
});

describe('GET /users', () => {
    it('should get all users', async () => {
        const response = await request(app)
            .get('/users');

        expect(response.status).toBe(200);
    });
});

describe('GET /users/:userId', () => {
    it('should get an user by id', async () => {
        expect(testUserId).toBeDefined();

        const response = await request(app)
            .get(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });
});

describe('PUT /users/:userId', () => {
    it('it should update the user name', async () => {
        expect(testUserId).toBeDefined();

        const updatedData = {
            name: 'Jane Doe'
        };

        const response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(response.status).toBe(200);

        const user = await User.findOne({ where: { id: testUserId } });
        expect(user.name).toBe(updatedData.name);
    });
});

describe('PUT /user/:userId', () => {
    it('should update the profile picture', async () => {
        expect(testUserId).toBeDefined();

        const updatedData = {
            profile_picture: 'http://example.com/janedoe.jpg'
        }

        const response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(response.status).toBe(200);

        const user = await User.findOne({ where: { id: testUserId } });
        expect(user.profile_picture).toBe(updatedData.profile_picture);
    });
});

describe('PUT /users/:userId', () => {
    it('should update the user name and profile picture', async () => {
        expect(testUserId).toBeDefined();

        const updatedData = {
            name: 'Jane Does',
            profile_picture: 'http://example.com/janedoe_updated.jpg'
        }

        const response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(response.status).toBe(200);

        const user = await User.findOne({ where: { id: testUserId } });
        expect(user.name).toBe(updatedData.name);
        expect(user.profile_picture).toBe(updatedData.profile_picture);
    });
});

describe('PUT /users/:uderId', () => {
    it('should not update the user when no fields are provided', async () => {
        expect(testUserId).toBeDefined();

        const response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(200);

        const user = await User.findOne({ where: { id: testUserId } });
        expect(user.name).toBe('Jane Does');
        expect(user.profile_picture).toBe('http://example.com/janedoe_updated.jpg');
    });
});

describe('POST /users/events', () => {
    it('should create an event', async () => {
        expect(testUserId).toBeDefined();

        const newEvent = {
            title: 'Event test',
            description: 'Test description',
            date: '17/08/2024',
            end_date: '18/08/2024',
            location: 'San Francisco, CA',
            adm_id: testUserId,
        }

        const response = await request(app)
            .post('/users/events')
            .set('Authorization', `Bearer ${token}`)
            .send(newEvent);

        expect(response.status).toBe(201);

        const createdEvent = await Event.findOne({ where: { title: newEvent.title, adm_id: newEvent.adm_id } });
        expect(createdEvent).not.toBeNull();
        expect(createdEvent.title).toBe(newEvent.title);
        expect(createdEvent.adm_id).toBe(newEvent.adm_id);

        testEventId = createdEvent.id;
    });
});

describe('GET /events', () => {
    it('should get all events', async () => {
        expect(testUserId).toBeDefined();

        const response = await request(app)
            .get('/events');

        expect(response.status).toBe(200);
    });
});

describe('GET /events/:eventId', () => {
    it('should get an event by id', async () => {
        expect(testUserId).toBeDefined();
        expect(testEventId).toBeDefined();

        const response = await request(app)
            .get(`/events/${testEventId}`);

        expect(response.status).toBe(200);
    });
});

describe('PUT /events/:eventId', () => {
    it('should update the event data', async () => {
        expect(testUserId).toBeDefined();
        expect(testEventId).toBeDefined();

        const updatedData = {
            title: 'Titulo de teste alterado.',
            description: 'Description de teste alterada.',
            date: '18/08/2024',
            end_date: '19/08/2024',
            location: 'Austin, TX'
        };

        const response = await request(app)
            .put(`/events/${testEventId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        console.log(response);


        expect(response.status).toBe(200);

        const event = await Event.findOne({ where: { id: testEventId } });
        expect(event.title).toBe(updatedData.title);

        if (updatedData.date) {
            const formattedDate = moment(event.date).startOf('day').format('YYYY-MM-DD');
            const expectedDate = moment(updatedData.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            expect(formattedDate).toBe(expectedDate);
        }

        if (updatedData.end_date) {
            const formattedEndDate = moment(event.end_date).startOf('day').format('YYYY-MM-DD');
            const expectedEndDate = moment(updatedData.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            expect(formattedEndDate).toBe(expectedEndDate);
        }

    });
});

describe('DELETE /events/:eventId', () => {
    it('should delete an event', async () => {
        expect(testUserId).toBeDefined();
        expect(testEventId).toBeDefined();

        const response = await request(app)
            .delete(`/events/${testEventId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);

        const deletedEvent = await Event.findByPk(testEventId);
        expect(deletedEvent).toBeNull();
    });
});

describe('DELETE /auth/delete', () => {
    it('must delete a user', async () => {
        expect(testUserId).toBeDefined();

        const response = await request(app)
            .delete(`/auth/delete/${testUserId}`);

        expect(response.status).toBe(200);
    });
});