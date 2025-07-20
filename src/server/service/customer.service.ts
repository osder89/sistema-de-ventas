import { ca } from "zod/v4/locales";
import * as customerRepository from "~/server/repository/customer.repository";


export const createCustomerService = async (data: {
  firstName: string; lastName: string;
  ci: string; email: string; phoneNumber: string; nit: string; birthDate: Date;
}) => {
  try {
    if (!data.firstName || !data.lastName || !data.ci || !data.email || !data.phoneNumber || !data.nit || !data.birthDate) {
      throw new Error("Datos del Cliente incompletos. Algunos campos están vacíos.");
    }

    const newCustomer = await customerRepository.createCustomer(data);
    return newCustomer;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear el cliente";
    throw new Error(`Error al crear el cliente: ${errorMessage}`);
  }
};


export const getPaginateCustomerService = async ( searchTerm: string, page: number, pageSize: number) => {
    try { 
        if (page <= 0 || pageSize <= 0 ) { 
            throw new Error("La página y el tamaño de página deben ser mayores a 0");
        }
        const result = await customerRepository.getPaginatedCustomers(searchTerm, page, pageSize)
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener los clientes";
        throw new Error(`Error al obtener los clientes: ${errorMessage}`);
    }
}

export const getCustomerByIdService = async (id: number ) => {
    try {
        if ( isNaN(id) || id <= 0 ) {
            throw new Error("ID de cliente inválido");
        }
        const customer = await customerRepository.getCustomerById(id);
        if (!customer) {
            throw new Error("Cliente no encontrado");
        }
        return customer;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener el cliente";
        throw new Error(`Error al obtener el cliente: ${errorMessage}`);
    }
} 

export const updateCustomerService = async ( id: number, data: {
    firstName?: string; lastName?: string;
    ci?: string; phone?: string; email?: string; address?: string;
    phoneNumber?: string; nit?: string; birthDate?: Date;
} ) => {
    try {
        if ( isNaN(id) || id <= 0 ) {
            throw new Error("ID de cliente inválido");
        }

        const updatedCustomer = await customerRepository.updateCustomer(id, data);
        return updatedCustomer;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el cliente";
        throw new Error(`Error al actualizar el cliente: ${errorMessage}`);
    }
}

export const deleteCustomerService = async ( id: number ) => {
    try {
        if ( isNaN(id) || id <= 0 ) {
            throw new Error("ID de cliente inválido");
        }

        const response = await customerRepository.deleteCustomer(id);
        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar el cliente";
        throw new Error(`Error al eliminar el cliente: ${errorMessage}`);
    }
}

export const getCustomerByCiService = async (ci: string) => {
    try {
        if (!ci) {
            throw new Error("CI de cliente inválido");
        }

        const response = await customerRepository.getCustomerByCi(ci);
        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener el cliente";
        throw new Error(`Error al obtener el cliente: ${errorMessage}`);
    }
}