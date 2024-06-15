import MongoManager from '../managers/mongoManager.js';
import FileSystemManager from '../managers/fileSystemManager.js';
import { CartModel, cartSchema } from '../../models/cart.model.js';
import { v4 as uuidv4 } from 'uuid';

class CartDAO {
  constructor(dataSource) {
    if (dataSource === 'mongo') {
      this.model = MongoManager.connection.model('carts', cartSchema);
    } else if (dataSource === 'fileSystem') {
      this.fileSystem = FileSystemManager;
      this.filePath = 'carts.json';
    }
  }

  async createCart(products) {
    if (this.model) {
      const cart = new this.model({ products });
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const newCart = { id: uuidv4(), products };
      carts.push(newCart);
      await this.fileSystem.writeFile(this.filePath, carts);
      return newCart;
    }
  }

  async getCartById(cartId) {
    if (this.model) {
      return await this.model.findById(cartId);
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      return carts.find((cart) => cart.id === cartId);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    if (this.model) {
      const cart = await this.model.findById(cartId);
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified('products');
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const cart = carts.find((cart) => cart.id === cartId);
      if (cart) {
        const productIndex = cart.products.findIndex(
          (item) => item.product === productId
        );
        if (productIndex !== -1) {
          cart.products[productIndex].quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }
        await this.fileSystem.writeFile(this.filePath, carts);
        return cart;
      }
    }
  }

  async deleteProductFromCart(cartId, productId) {
    if (this.model) {
      const cart = await this.model.findById(cartId);
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const cart = carts.find((cart) => cart.id === cartId);
      if (cart) {
        cart.products = cart.products.filter(
          (item) => item.product !== productId
        );
        await this.fileSystem.writeFile(this.filePath, carts);
        return cart;
      }
    }
  }

  async updateCart(cartId, updatedProducts) {
    if (this.model) {
      const cart = await this.model.findById(cartId);
      cart.products = updatedProducts;
      cart.markModified('products');
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const cart = carts.find((cart) => cart.id === cartId);
      if (cart) {
        cart.products = updatedProducts;
        await this.fileSystem.writeFile(this.filePath, carts);
        return cart;
      }
    }
  }

  async updateQuantity(cartId, productId, newQuantity) {
    if (this.model) {
      const cart = await this.model.findById(cartId);
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        cart.markModified('products');
        return await cart.save();
      }
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const cart = carts.find((cart) => cart.id === cartId);
      if (cart) {
        const productIndex = cart.products.findIndex(
          (item) => item.product === productId
        );
        if (productIndex !== -1) {
          cart.products[productIndex].quantity = newQuantity;
          await this.fileSystem.writeFile(this.filePath, carts);
          return cart;
        }
      }
    }
  }

  async emptyCart(cartId) {
    if (this.model) {
      const cart = await this.model.findById(cartId);
      cart.products = [];
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const cart = carts.find((cart) => cart.id === cartId);
      if (cart) {
        cart.products = [];
        await this.fileSystem.writeFile(this.filePath, carts);
        return cart;
      }
    }
  }
}

export default CartDAO;
