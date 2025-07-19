import { db } from "~/server/db";

export const createProduct = async (data: { name: string; description: string; price: number; quantity: number }) => {
  return await db.product.create({
    data,
  });
};

export const getPaginatedProducts = async (searchTerm: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;

  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    skip: skip,
    take: pageSize,
  });

  const totalCount = await db.product.count({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
  });

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

export const getProductById = async (id: number) => {
  return await db.product.findUnique({
    where: { id },
  });
};

export const updateProduct = async (
  id: number,
  data: { name?: string; description?: string; price?: number; quantity?: number }
) => {
  return await db.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  await db.product.delete({
    where: { id },
  });
  return { message: "Producto eliminado exitosamente" };
};
