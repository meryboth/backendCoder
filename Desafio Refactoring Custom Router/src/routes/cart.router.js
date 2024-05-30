// routes/cart.router.js
import CustomRouter from './router.js';
import CartService from '../services/cart.services.js';

class CartRouter extends CustomRouter {
  init() {
    this.post('/', this.createCart);
    this.get('/:cid', this.getCart);
    this.post('/:cid/product/:pid', this.addProductToCart);
    this.delete('/:cid/product/:pid', this.deleteProductFromCart);
    this.put('/:cid', this.updateCart);
    this.put('/:cid/product/:pid', this.updateProductQuantity);
    this.delete('/:cid', this.emptyCart);
  }

  async createCart(req, res) {
    try {
      const products = req.body.products;
      const nuevoCarrito = await CartService.createCart(products);
      res.json(nuevoCarrito);
    } catch (error) {
      console.error('Error al crear un nuevo carrito', error);
      res.sendServerError('Error interno del servidor');
    }
  }

  async getCart(req, res) {
    const cartId = req.params.cid;

    try {
      const carrito = await CartService.getCart(cartId);
      return res.json(carrito.products);
    } catch (error) {
      console.error('Error al obtener el carrito', error);
      res.sendServerError('Error interno del servidor');
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      const actualizarCarrito = await CartService.addProductToCart(
        cartId,
        productId,
        quantity
      );
      res.json(actualizarCarrito.products);
    } catch (error) {
      console.error('Error al agregar producto al carrito', error);
      res.sendServerError('Error interno del servidor');
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const updatedCart = await CartService.deleteProductFromCart(
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
      res.sendServerError('Error interno del servidor');
    }
  }

  async updateCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
      const updatedCart = await CartService.updateCart(cartId, updatedProducts);
      res.json(updatedCart);
    } catch (error) {
      console.error('Error al actualizar el carrito', error);
      res.sendServerError('Error interno del servidor');
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;

      const updatedCart = await CartService.updateProductQuantity(
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
      res.sendServerError('Error interno del servidor');
    }
  }

  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;

      const updatedCart = await CartService.emptyCart(cartId);

      res.json({
        status: 'success',
        message:
          'Todos los productos del carrito fueron eliminados correctamente',
        updatedCart,
      });
    } catch (error) {
      console.error('Error al vaciar el carrito', error);
      res.sendServerError('Error interno del servidor');
    }
  }
}

export default new CartRouter().getRouter();
