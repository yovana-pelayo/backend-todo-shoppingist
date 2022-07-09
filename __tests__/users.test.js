const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

const mockUser = {
  username: 'Clues',
  email: 'blue@yahoo.com',
  password: '123456'
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;

//   const agent = request.agent(app);

//   const user = await UserService.create({ ...mockUser, ...userProps });
//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send({ email, password });
//   return [agent, user];
// };
describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it(' creates new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { username, email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      username,
      email
    });
  });
  // it('signs in an existing user', async () => {
  //   await request(app).post('/api/v1/users').send(mockUser);
  //   const res = await request(app).post('/api/v1/users/sessions').send({ email: 'blue@yahoo.com', password: '123456' });
  //   // console.log(res.body);
  //   expect(res.status).toEqual(200);
  // });
  afterAll(() => {
    pool.end();
  });
});
