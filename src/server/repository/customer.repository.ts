import { db } from "~/server/db";

export const createCustomer = async (data: {
    firstName: string; lastName: string;
    ci: string; email: string;
    phoneNumber: string; nit: string; birthDate: Date;
}) => {
    return await db.customer.create({
        data,
    })
}

export const getPaginatedCustomers = async (searchTerm: string, page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize;

    const customers = await db.customer.findMany({
        where: {
            OR: [
                { firstName: { contains: searchTerm, mode: "insensitive" } },
                { lastName: { contains: searchTerm, mode: "insensitive" } },
                { ci: { contains: searchTerm, mode: "insensitive" } },
                { phoneNumber: { contains: searchTerm, mode: "insensitive" } },
            ],
        },
        skip,
        take: pageSize,
    });

    const totalCount = await db.customer.count({
        where: {
            OR: [
                { firstName: { contains: searchTerm, mode: "insensitive" } },
                { lastName: { contains: searchTerm, mode: "insensitive" } },
                { ci: { contains: searchTerm, mode: "insensitive" } },
                { phoneNumber: { contains: searchTerm, mode: "insensitive" } },
            ],
        },
    });

    return {
        customers,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
    };
}

export const updateCustomer = async ( 
    id: number, 
    data: { firstName?: string; lastName?: string;
    ci?: string; phone?: string; email?: string; address?: string;
    phoneNumber?: string; nit?: string; birthDate?: Date }
) => {
    return await db.customer.update({
        where: { id },
        data,
    });
}

export const deleteCustomer =async (id : number) => {
    await db.customer.delete({
        where: { id }
    });
    return { message: "Cliente eliminado exitosamente" };
}

export const getCustomerById = async (id: number) => {
    await db.customer.findUnique({
        where: { id }
    });
    return { message: "Cliente no encontrado" };
}

export const getCustomerByCi = async (ci: string) => {
  return db.customer.findUnique({
    where: { ci: ci.trim() },
  }); 
};

