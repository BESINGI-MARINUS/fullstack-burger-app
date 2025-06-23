const fs = require('fs');
const path = require('path');

const express = require('express');
const morgan = require('morgan');

const productRoutes = require('./Routes/productRoutes');
const userRoutes = require('./Routes/userRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(morgan('dev'));

app.use('/api/v1/burgers', productRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res, next) => {
  const products = prodsFromFile;
  res.render(`index`, { products });
});

app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  const product = prodsFromFile.find((p) => p.id === +id);
  res.render('product', { product });
});

app.post('/add-to-cart', (req, res, next) => {
  const { id } = req.body;
  let fetchedCart;
  fs.readFile(`${__dirname}/data/cart.json`, 'utf8', (err, data) => {
    if (err) res.status(404).send("<h1>Couldn't get cart</h1>");
    fetchedCart = data;
    const prodToAdd = prodsFromFile.filter((prod) => prod.id === id);
    const prodAlreadyInCart = fetchedCart[0].products.filter(
      (p) => p.id === id
    );
    console.log(prodAlreadyInCart);
  });
  res.status(200).send('<h1>Your Cart</h1>');
});

app.use((req, res) => {
  res.status(404).send('<h1>Page not found!</h1>');
});

const port = 8000;
app.listen(port, '127.0.0.1', () => {
  console.log('Listening to server request on port 8000');
});
