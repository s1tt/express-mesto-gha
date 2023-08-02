const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const routerUser = require('./routes/users');

const routerCard = require('./routes/cards');

const errorStatus = require('./utils/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64c988449685024bf1a1a9dc',
  };

  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.all('*', (req, res) => {
  res.status(errorStatus.NOT_FOUND).send({ message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
