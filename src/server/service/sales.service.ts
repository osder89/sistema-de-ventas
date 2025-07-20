import { db } from "~/server/db";
import * as salesRepository from "~/server/repository/sales.repository";
import * as salesProductRepository from "~/server/repository/salesProduct.repository";  

export const createSaleService = async (saleData: {
  customerId: number;
  products: { productId: number; quantity: number; salePrice: number }[];
}) => {
  if (!saleData.customerId) {
    throw new Error("customerId requerido");
  }
  if (!Array.isArray(saleData.products) || saleData.products.length === 0) {
    throw new Error("Debe enviar al menos un producto");
  }

  const transactionResult = await db.$transaction(async (prisma) => {
    const productIds = saleData.products.map(p => p.productId);

    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, quantity: true } 
    });

    if (dbProducts.length !== productIds.length) {
      const foundIds = new Set(dbProducts.map(p => p.id));
      const missing = productIds.filter(id => !foundIds.has(id));
      throw new Error(`Productos inexistentes: ${missing.join(", ")}`);
    }

    for (const line of saleData.products) {
      const dbProd = dbProducts.find(p => p.id === line.productId)!;
      if (line.quantity <= 0 || !Number.isInteger(line.quantity)) {
        throw new Error(`Cantidad inválida para producto ${line.productId}`);
      }
      if (dbProd.quantity < line.quantity) {
        throw new Error(`Stock insuficiente para producto ${line.productId} (disponible: ${dbProd.quantity}, solicitado: ${line.quantity})`);
      }
    }

    const sale = await prisma.sale.create({
      data: {
        customerId: saleData.customerId,
        totalAmount: 0,
        date: new Date()
      }
    });

    let totalAmount = 0;

    for (const line of saleData.products) {
      totalAmount += line.salePrice * line.quantity;

      await prisma.saleProduct.create({
        data: {
          saleId: sale.id,
          productId: line.productId,
            quantity: line.quantity,
          salePrice: line.salePrice
        }
      });

      await prisma.product.update({
        where: { id: line.productId },
        data: { quantity: { decrement: line.quantity } }
      });
    }

    const updatedSale = await prisma.sale.update({
      where: { id: sale.id },
      data: { totalAmount },
      include: {
        products: {
          include: { product: true }
        },
        customer: true
      }
    });

    return updatedSale;
  });

  return transactionResult;
};


export const getSaleServiceById = async (id: number) => {
  try {
    if (!id || id <= 0) {
      throw new Error("ID de venta inválido");
    }

    const sale = await salesRepository.getSaleById(id);
    if (!sale) {
      throw new Error("Venta no encontrada");
    }
    return sale;
  } catch (error) {
    throw new Error(`Error al obtener la venta: ${error instanceof Error ? error.message : "Error desconocido"}`);
  }
};

export const getPaginatedSalesService = async (searchTerm: string, page: number, pageSize: number) => {
  try {
    if (page <= 0 || pageSize <= 0) {
      throw new Error("La página y el tamaño de página deben ser mayores a 0");
    }

    const result = await salesRepository.getPaginatedSales(searchTerm, page, pageSize);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al obtener las ventas: ${errorMessage}`);
  }
};



