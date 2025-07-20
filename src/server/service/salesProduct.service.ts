import * as salesProductRepository from "~/server/repository/salesProduct.repository";  

export const getSaleProductsPaginatedService = async (
  saleId: number,
  page: number,
  pageSize: number,
  searchTerm: string
) => {
  try {
    if (!Number.isInteger(saleId) || saleId <= 0) {
      throw new Error("saleId inválido");
    }
    if (!Number.isInteger(page) || page <= 0) {
      throw new Error("La página debe ser > 0");
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new Error("El tamaño de página debe ser > 0");
    }

    const result = await salesProductRepository.getSaleProductsPaginated(saleId, page, pageSize, searchTerm || "");
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al obtener productos de la venta: ${msg}`);
  }
};
