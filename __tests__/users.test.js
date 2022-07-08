const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'blue@yahoo.com',
  password: '123456',
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST /api/v1/users creates new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  it.only('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app).post('/api/v1/users/sessions').send({ email: 'blue@yahoo.com', password: '123456' });
    expect(res.status).toEqual(200);
  });
  afterAll(() => {
    pool.end();
  });
});
