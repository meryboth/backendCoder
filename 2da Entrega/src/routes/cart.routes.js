import express from 'express';
const router = express.Router();
import CartManager from '../controllers/cart-manager.js';
const cartManager = new CartManager();
import CartModel from '../models/cart.model.js';

/* Creates a new cart */
router.post('/', async (req, res) => {
  try {
    const products = req.body.products;
    const nuevoCarrito = await cartManager.newCart(products);
    res.json(nuevoCarrito);
  } catch (error) {
    console.error('Error al crear un nuevo carrito', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/* Show the content of a cart */
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await CartModel.findById(cartId);

    if (!carrito) {
      console.log('No existe ese carrito con el id');
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    return res.json(carrito.products);
  } catch (error) {
    console.error('Error al obtener el carrito', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/* Add products to the cart */
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error('Error al agregar producto al carrito', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/* Deletes a specific product from the cart */
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartManager.deleteProductFromCart(
      cartId,
      productId
    );

    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito correctamente',
      updatedCart,
    });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }
});

/* Updates products from the cart */
router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;
  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al actualizar el carrito', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }
});

/* Update quantity of a product in the cart */
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await cartManager.updateQuantity(
      cartId,
      productId,
      newQuantity
    );

    res.json({
      status: 'success',
      message: 'Cantidad del producto actualizada correctamente',
      updatedCart,
    });
  } catch (error) {
    console.error(
      'Error al actualizar la cantidad del producto en el carrito',
      error
    );
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }
});

/* Empty Cart */
router.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await cartManager.emptyCart(cartId);

    res.json({
      status: 'success',
      message:
        'Todos los productos del carrito fueron eliminados correctamente',
      updatedCart,
    });
  } catch (error) {
    console.error('Error al vaciar el carrito', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }
});

export default router;
