import express from 'express';
const router = express.Router();
import ProductModel from '../models/product.model.js';
import ProductManager from '../controllers/product-manager.js';
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();
    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.render('products', { productos });
    }
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

export default router;
