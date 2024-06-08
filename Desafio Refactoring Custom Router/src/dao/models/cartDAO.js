import MongoManager from '../managers/mongoManager.js';
import FileSystemManager from '../managers/fileSystemManager.js';
import { cartSchema } from '../../models/cart.model.js';
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

  async createCart(cartData) {
    if (this.model) {
      const cart = new this.model(cartData);
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const newCart = { id: uuidv4(), ...cartData };
      carts.push(newCart);
      await this.fileSystem.writeFile(this.filePath, carts);
      return newCart;
    }
  }

  async getCartById(cartId) {
    if (this.model) {
      return await this.model.findById(cartId).populate('products.product');
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      return carts.find((cart) => cart.id === cartId);
    }
  }

  async updateCart(cartId, updateData) {
    if (this.model) {
      return await this.model.findByIdAndUpdate(cartId, updateData, {
        new: true,
      });
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const index = carts.findIndex((cart) => cart.id === cartId);
      if (index !== -1) {
        carts[index] = { ...carts[index], ...updateData };
        await this.fileSystem.writeFile(this.filePath, carts);
        return carts[index];
      }
      return null;
    }
  }

  async deleteCart(cartId) {
    if (this.model) {
      return await this.model.findByIdAndDelete(cartId);
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const index = carts.findIndex((cart) => cart.id === cartId);
      if (index !== -1) {
        const deletedCart = carts.splice(index, 1);
        await this.fileSystem.writeFile(this.filePath, carts);
        return deletedCart[0];
      }
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    if (this.model) {
      const cart = await this.model.findById(cartId);
      const index = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (index !== -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      return await cart.save();
    } else if (this.fileSystem) {
      const carts = (await this.fileSystem.readFile(this.filePath)) || [];
      const cart = carts.find((cart) => cart.id === cartId);
      if (cart) {
        const index = cart.products.findIndex(
          (item) => item.product === productId
        );
        if (index !== -1) {
          cart.products[index].quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }
        await this.fileSystem.writeFile(this.filePath, carts);
        return cart;
      }
      return null;
    }
  }
}

export default CartDAO;
