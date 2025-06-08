const fs = require('fs');
const path = require('path');

const express = require('express');

// const http = require("http");
// const url = require("url");

// const tempIndex = fs.readFileSync(`${__dirname}/templates/index.html`, "utf-8");
// const tempProduct = fs.readFileSync(
//   `${__dirname}/templates/product.html`,
//   "utf-8"
// );

///////////////////////////////////
///// PURE NODE
// const server = http.createServer((req, res) => {
//   const url = req.url;
//   if (url === "/" || url === "/home") {
//     res.writeHead(200, { "Content-type": "text/html" });
//     res.end(tempIndex);
//   } else if (url === "/api") {
//     res.writeHead(200, { "Content-Type": "application/json" }).end(api);
//   } else if (url === "/product") {
//     res.writeHead(200, { "Content-Type": "text/html" }).end(tempProduct);
//   } else {
//     res.writeHead(404, { "Content-Type": "text/html" });
//     res.end(`Page not found ${res.statusCode}`);
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to request on port 8000");
// });

////////////////////////////////////
//// EXPRESS
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const productsData = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  const products = JSON.parse(productsData);
  res.render(`index`, { products });
});

app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  const products = JSON.parse(productsData);
  const product = products.find((p) => p.id === id);
  res.render('product', { product });
});

app.get('/cart', (req, res) => {
  res.status(200).send('<h1>Your Cart</h1>');
});

app.use((req, res) => {
  res.status(404).send('<h1>Page not found!</h1>');
});

app.listen(8000, '127.0.0.1', () => {
  console.log('Listening to server request on port 8000');
});
