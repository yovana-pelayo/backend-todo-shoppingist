const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');


const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userToken = await UserService.login({ email, password });
      res
      .cookie(process.env.COOKIE_NAME, userToken, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
        })
        .json({ message: 'Signed in successfully' });
    } catch (error) {
      next(error);
    }
  })
  .get('/me',  (req, res) => {
    res.json(req.user);
  });
