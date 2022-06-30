const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'blue@yahoo.com',
  password: '1234567',
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST creates new user', async () => {
    const resp = await request(app).post('api/1/users').send(mockUser);
    const { email } = mockUser;
    expect(resp.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
