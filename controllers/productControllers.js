const fs = require('fs');
const prodsFromFile = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/data.json`, 'utf-8')
);

exports.getAllProducts = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    requestDate: req.requestTime,
    result: prodsFromFile.length,
    data: {
      burgers: prodsFromFile,
    },
  });
};

exports.getProduct = (req, res) => {
  const { id } = req.params;
  const burger = prodsFromFile.find((p) => p.id === +id);
  if (!burger) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: burger,
  });
};

exports.addProduct = (req, res) => {
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
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  if (id > prodsFromFile.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: 'Updated product here',
  });
};
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  if (id > prodsFromFile.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
