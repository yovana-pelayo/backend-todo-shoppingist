const { Router } = require('express');

module.exports = Router().post('/', async (req, res, next) => {
  try {
      const user= await UserService
  } catch (e) {
    next(e);
  }
});
