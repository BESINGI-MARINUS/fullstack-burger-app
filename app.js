const fs = require('fs');
const path = require('path');

const express = require('express');

////////////////////////////////////
//// EXPRESS
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const prodsFromFile = JSON.parse(
  fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8')
);
// const cart = JSON.parse(fs.readFileSync(`${__dirname}/data/cart.json`));

app.use(express.static(path.join(__dirname, 'public')));

// ========= APIs ==========
app.get('/api/v1/burgers', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    result: prodsFromFile.length,
    data: {
      burgers: prodsFromFile,
    },
  });
});

app.get('/api/v1/burgers/:id', (req, res) => {
  const { id } = req.params;
  const burger = prodsFromFile.find((p) => p.id === +id);
  res.status(200).json({
    status: 'success',
    data: burger,
  });
});

app.post('/api/v1/burgers', (req, res) => {
  const product = req.body;
  const id = prodsFromFile.at(-1).id + 1;
  const newProd = Object.assign({ id }, product);
  prodsFromFile.push(newProd);
  fs.writeFile(
    `${__dirname}/data/data.json`,
    JSON.stringify(prodsFromFile),
    (err) => {
      console.log(err);
    }
  );
  res.status(201).json({ status: 'success', data: newProd });
});

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
