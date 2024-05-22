// /routers/views.router.js
import CustomRouter from './router.js';
import ProductModel from '../models/product.model.js';
import CartManager from '../controllers/cart-manager.js';
import { authenticateJWT, isAdmin } from '../middlewares/auth.js';

const cartManager = new CartManager();

class ViewsRouter extends CustomRouter {
  init() {
    this.get('/', this.getProducts);
    this.get('/carts/:cid', this.getCart);
    this.get('/login', this.renderLogin);
    this.get('/register', this.renderRegister);
    this.get('/profile', authenticateJWT, this.renderProfile);
    this.get('/admin', authenticateJWT, isAdmin, this.renderAdmin);
  }

  async getProducts(req, res) {
    try {
      let page = req.query.page || 1;
      let limit = parseInt(req.query.limit) || 10;
      const productos = await ProductModel.paginate({}, { limit, page });
      const productosMap = productos.docs.map((producto) => {
        const { _id, ...rest } = producto.toObject();
        return rest;
      });

      res.render('products', {
        productos: productosMap.slice(0, limit),
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        currentPage: productos.page,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        totalPage: productos.totalPages,
      });
    } catch (error) {
      console.error('Failed to fetch products', error);
      res.sendServerError('Internal Server Error. Failed to fetch products.');
    }
  }

  async getCart(req, res) {
    const cartId = req.params.cid;

    try {
      const carrito = await cartManager.getCartById(cartId);

      if (!carrito) {
        console.log('No cart found with the provided ID.');
        return res.sendUserError('Cart not found.');
      }

      const productosEnCarrito = carrito.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));

      res.render('carts', { productos: productosEnCarrito });
    } catch (error) {
      console.error('Error fetching cart', error);
      res.sendServerError('Internal Server Error. Failed to fetch cart.');
    }
  }

  renderLogin(req, res) {
    res.render('login');
  }

  renderRegister(req, res) {
    res.render('register');
  }

  renderProfile(req, res) {
    res.render('profile', { user: req.user });
  }

  renderAdmin(req, res) {
    res.render('admin', { user: req.user });
  }
}

export default new ViewsRouter().getRouter();
