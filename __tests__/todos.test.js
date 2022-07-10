const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


const mockUser = {
  email: 'neo@yahoo.com', 
  password: 'whiterabbit'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};
describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('POST /api/v1/items creates a new shopping item with the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const newTodo = { description: 'coffee beans' };
    const resp = await agent.post('/api/v1/todos').send(newTodo);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      description: newTodo.description,
      user_id: user.id,
      complete: false,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
