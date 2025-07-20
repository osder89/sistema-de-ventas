import * as productRepository from "~/server/repository/product.repository";

export const createProductService = async (data: { name: string; description: string; price: number; quantity: number }) => {
  try {
    if (!data.name || !data.price || data.quantity <= 0) {
      throw new Error("Datos del producto inválidos");
    }

    const newProduct = await productRepository.createProduct(data);
    return newProduct;
  } catch (error ) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al crear el producto: ${errorMessage}`);
  }
};

export const getPaginatedProductsService = async (searchTerm: string, page: number, pageSize: number) => {
  try {
    if (page <= 0 || pageSize <= 0) {
      throw new Error("La página y el tamaño de página deben ser mayores a 0");
    }

    const result = await productRepository.getPaginatedProducts(searchTerm, page, pageSize);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al obtener los productos: ${errorMessage}`);
  }
};

export const getProductByIdService = async (id: number) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de producto no válido");
    }

    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al obtener el producto: ${errorMessage}`);
  }
};

export const updateProductService = async (
  id: number,
  data: { name?: string; description?: string; price?: number; quantity?: number }
) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de producto no válido");
    }

    const updatedProduct = await productRepository.updateProduct(id, data);
    return updatedProduct;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al actualizar el producto: ${errorMessage}`);
  }
};

export const deleteProductService = async (id: number) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de producto no válido");
    }

    const response = await productRepository.deleteProduct(id);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al eliminar el producto: ${errorMessage}`);
  }
};

export const searchProductsService = async (searchTerm: string, page: number, pageSize: number) => {
  try {
    if (page <= 0 || pageSize <= 0) {
      throw new Error("La página y el tamaño de página deben ser mayores a 0");
    }

    const result = await productRepository.searchProducts(searchTerm, page, pageSize);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al buscar los productos: ${errorMessage}`);
  }
};
