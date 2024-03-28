import express from 'express';
const router = express.Router();
import ProductManager from './productManager'; // Importa ProductManager
const productManager = new ProductManager('./src/products.json'); // Crea una instancia de ProductManager

// Get ALL PRODUCTS IN REAL TIME
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST NEW PRODUCT
router.post('/realtimeproducts', async (req, res) => {
  try {
    await productManager.addProduct(req.body);
    res.status(201).send('Producto creado exitosamente.');
  } catch (error) {
    res.status(500).send('Error al agregar el producto.');
  }
});

// DELETE PRODUCT BY ID
router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.status(200).send('Producto eliminado exitosamente.');
  } catch (error) {
    res.status(500).send('Error al eliminar el producto.');
  }
});

/* Exportamos */
export default router;
