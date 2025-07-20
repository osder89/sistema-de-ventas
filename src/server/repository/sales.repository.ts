import { db } from "~/server/db";

export const createSale = async (saleData: { customerId: number; totalAmount: number }) => {
  const sale = await db.sale.create({
    data: {
      customerId: saleData.customerId,
      totalAmount: saleData.totalAmount,
      date: new Date(),
    },
  });
  return sale;
};

export const getSaleById = async (id: number) => {
  const sale = await db.sale.findUnique({
    where: { id },
    include: { products: true },
  });
  return sale;
};

export const getPaginatedSales = async (searchTerm: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;

  const sales = await db.sale.findMany({
    where: {
      OR: [
        { customer: { firstName: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { lastName: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { ci: { contains: searchTerm, mode: "insensitive" } } },
      ],
    },
    skip: skip,
    take: pageSize,
    include: { customer: true },
  });

  const totalCount = await db.sale.count({
    where: {
      OR: [
        { customer: { firstName: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { lastName: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { ci: { contains: searchTerm, mode: "insensitive" } } },
      ],
    },
  });

  return {
    sales,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};
