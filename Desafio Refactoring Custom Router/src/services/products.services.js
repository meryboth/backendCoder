import ProductModel from '../models/product.model.js';

class ProductService {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const queryOptions = query
      ? { name: { $regex: query, $options: 'i' } }
      : {};
    const sortOptions = sort ? { [sort]: 1 } : {};

    const options = {
      page,
      limit,
      sort: sortOptions,
      lean: true, // Para obtener objetos JavaScript planos en lugar de documentos Mongoose
    };

    return await ProductModel.paginate(queryOptions, options);
  }

  async getProductById(id) {
    const producto = await ProductModel.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async addProduct(productData) {
    const nuevoProducto = new ProductModel(productData);
    await nuevoProducto.save();
    return nuevoProducto;
  }

  async updateProduct(id, productData) {
    const productoActualizado = await ProductModel.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    );
    if (!productoActualizado) {
      throw new Error('Producto no encontrado');
    }
    return productoActualizado;
  }

  async deleteProduct(id) {
    const productoEliminado = await ProductModel.findByIdAndDelete(id);
    if (!productoEliminado) {
      throw new Error('Producto no encontrado');
    }
    return productoEliminado;
  }
}

export default new ProductService();
