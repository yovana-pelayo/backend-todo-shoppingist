const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Todo = require('../lib/models/Todo');


const mockUser = {
  email: 'neo@yahoo.com', 
  password: 'whiterabbit'
};
const mockUser2 = {
  email: 'trinity@yahoo.com', 
  password: 'neothechosenone'
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
  
  it('POST /api/v1/todos creates a new shopping item with the current user', async () => {
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
  it('GET  /api/v1/todos returns all todos with authenticated user', async () => {
    const [agent, user] = await registerAndLogin();

    const user2 = await UserService.create(mockUser2);
    const userTodo = await Todo.insert({
      description: 'trash bags',
      user_id: user.id,
    });
    await Todo.insert({
      description: 'return library book',
      user_id: user2.id,
    });
    const resp = await agent.get('/api/v1/todos');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([userTodo]);
  });
  it('UPDATE /api/v1/todos/:id updates a todo if associated with authenticated user, 403 for invalid users!!', async () => {
    const [agent] = await registerAndLogin();
    const user2 = await UserService.create(mockUser2);
    const todo = await Todo.insert({
      description: 'write out 100 JavaScript note cards',
      user_id: user2.id,
    });
    const resp = await agent.put(`/api/v1/todos/${todo.id}`).send({ complete: true });
    expect(resp.status).toBe(403);
  });

  it('Put /api/v1/todos/:id should update a todo by authorized user!', async () => {
    const [agent, user] = await registerAndLogin();
    const todo = await Todo.insert({
      description: 'return 2 library books',
      user_id: user.id,
    });
    const resp = await agent.put(`/api/v1/todos/${todo.id}`).send({ complete: true });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ ...todo, complete:true });
  });
  it.only('DELETE api/v1/todos/:id deletes a todo by authorized user', async () => {
    const [agent, user] = await registerAndLogin();
    const todo = await Todo.insert({
      description: 'finish career service assignment',
      user_id: user.id,
    });

    const resp = await agent.delete(`/api/v1/todos/${todo.id}`);
    expect(resp.status).toBe(200);

    const check = await Todo.getById(todo.id);
    expect(check).toBeNull();
  });
  afterAll(() => {
    pool.end();
  });
});
