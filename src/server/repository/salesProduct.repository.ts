import { db } from "~/server/db";

export const addProductsToSale = async (
  saleId: number,
  products: { productId: number; quantity: number; salePrice: number }[]
) => {
  let totalAmount = 0;

  for (const product of products) {
    const { productId, quantity, salePrice } = product;

    await db.saleProduct.create({
      data: {
        saleId,
        productId,
        quantity,
        salePrice,
      },
    });

    totalAmount += salePrice * quantity;
  }

  return totalAmount;
};

export const getSaleProductsPaginated = async (
  saleId: number,
  page = 1,
  pageSize = 10,
  search = ""
) => {
  if (!Number.isInteger(saleId) || saleId <= 0) {
    throw new Error("saleId inválido");
  }

  const currentPage = page < 1 ? 1 : page;
  const take = pageSize < 1 ? 10 : pageSize;
  const skip = (currentPage - 1) * take;

  const where: any = {
    saleId,
    ...(search
      ? {
        product: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }
      : {}),
  };

  const [items, total] = await Promise.all([
    db.saleProduct.findMany({
      where,
      skip,
      take,
      orderBy: { id: "asc" },
      include: {
        product: true,
      },
    }),
    db.saleProduct.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return {
    saleId,
    items,
    page: currentPage,
    pageSize: take,
    total,
    totalPages,
  };
};
