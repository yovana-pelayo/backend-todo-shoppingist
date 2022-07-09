const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  username: 'Clues',
  email: 'blue@yahoo.com',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};


//  we are assigning an email to be user info, then we are storing that user information in a token and sending the email and password that authenticates the user. This info is stored in a token to be used by user but what is the difference between this and creating a user? Is it just the token with data storage? Like, now that the user is created we can call it and use it so.. I think I get it. 
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
  //   const [agent, user] = await registerAndLogin();
  //   const me = await agent.get('/api/v1/users/me');
  //   console.log(me.body);
  //   expect(me.body).toEqual({
  //     ...user,
  //     exp: expect.any(Number),
  //     iat: expect.any(Number),
  //   });
  // });

  afterAll(() => {
    pool.end();
  });
});
