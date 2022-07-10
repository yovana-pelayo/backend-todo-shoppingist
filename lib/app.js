const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
// const cors = require('cors');


// Built in middleware
app.use(express.json());
app.use(cookieParser());
// App routes
// cookie parser is what stores user info//

app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/todos', require('./controllers/todos'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
