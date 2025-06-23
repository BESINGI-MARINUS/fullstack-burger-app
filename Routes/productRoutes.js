const express = require('express');

const productControllers = require('../controllers/productControllers');

const router = express.Router();

router
  .route('/')
  .get(productControllers.getAllProducts)
  .post(productControllers.addProduct);
router
  .route('/:id')
  .get(productControllers.getProduct)
  .patch(productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

module.exports = router;
