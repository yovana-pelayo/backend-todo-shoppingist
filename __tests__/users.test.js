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
  it('POST /sessions logs in new user and creates a cookie', async () => {
    await UserService.create(mockUser);
    const { email, password } = mockUser;
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email, password });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Signed in successfully!' });
  });
  afterAll(() => {
    pool.end();
  });
});
