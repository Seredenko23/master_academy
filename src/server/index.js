const express = require('express');
const bodyParser = require('body-parser');
const task = require('./router/task');
const sales = require('./router/sales');
const products = require('./router/products');
const auth = require('./middlewares/basicAuth');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);

app.use('/task', task);
app.use('/sales', sales);
app.use('/products', products);

app.get('/', (req, res) => {
  res.send('Home');
});

app.use(errorHandler);

module.exports = app;
