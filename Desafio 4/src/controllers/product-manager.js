import fs from 'fs';

/**
 * ProductManager class handles operations related to managing products in an online store.
 */
class ProductManager {
  static lastId = 0;

  /**
   * Constructor for ProductManager class.
   * @param {string} path - Path to the file storing product data.
   */
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  /**
   * Adds a new product to the store.
   * @param {object} product - Product details.
   */
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const productsArray = await this.readFile();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log('All fields are mandatory');
        return;
      }

      if (productsArray.some((item) => item.code === code)) {
        console.log('Code must be unique');
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      };

      if (productsArray.length > 0) {
        ProductManager.lastId = productsArray.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
      }

      newProduct.id = ++ProductManager.lastId;

      productsArray.push(newProduct);
      await this.saveFile(productsArray);
    } catch (error) {
      console.log('Error adding product', error);
      throw error;
    }
  }

  /**
   * Retrieves all products from the store.
   * @returns {Array} - Array of products.
   */
  async getProducts() {
    try {
      const productsArray = await this.readFile();
      return productsArray;
    } catch (error) {
      console.log('Error reading file', error);
      throw error;
    }
  }

  /**
   * Retrieves a product by its ID.
   * @param {number} id - Product ID.
   * @returns {object|null} - Product object if found, otherwise null.
   */
  async getProductById(id) {
    try {
      const productsArray = await this.readFile();
      const found = productsArray.find((item) => item.id === id);

      if (!found) {
        console.log('Product not found');
        return null;
      } else {
        console.log('Product found');
        return found;
      }
    } catch (error) {
      console.log('Error reading file', error);
      throw error;
    }
  }

  /**
   * Reads product data from the file.
   * @returns {Array} - Array of products.
   */
  async readFile() {
    try {
      const response = await fs.promises.readFile(this.path, 'utf-8');
      const productsArray = JSON.parse(response);
      return productsArray;
    } catch (error) {
      console.log('Error reading file', error);
      throw error;
    }
  }

  /**
   * Saves product data to the file.
   * @param {Array} productsArray - Array of products to be saved.
   */
  async saveFile(productsArray) {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productsArray, null, 2)
      );
    } catch (error) {
      console.log('Error saving file', error);
      throw error;
    }
  }

  /**
   * Updates a product with new information.
   * @param {number} id - Product ID.
   * @param {object} updatedProduct - New product details.
   */
  async updateProduct(id, updatedProduct) {
    try {
      const productsArray = await this.readFile();

      const index = productsArray.findIndex((item) => item.id === id);

      if (index !== -1) {
        productsArray[index] = {
          ...productsArray[index],
          ...updatedProduct,
        };
        await this.saveFile(productsArray);
        console.log('Product updated');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('Error updating product', error);
      throw error;
    }
  }

  /**
   * Deletes a product from the store.
   * @param {number} id - Product ID.
   */
  async deleteProduct(id) {
    try {
      const productsArray = await this.readFile();

      const index = productsArray.findIndex((item) => item.id === id);

      if (index !== -1) {
        productsArray.splice(index, 1);
        await this.saveFile(productsArray);
        console.log('Product deleted');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('Error deleting product', error);
      throw error;
    }
  }
}

export default ProductManager;
