export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  ci: string;
  email: string;
  phoneNumber: string;
  nit: string;
  birthDate: Date;
  birthCountry: string;
}

export interface Sale {
  id: number;
  customerId: number;
  customer: Customer;
  date: Date;
  totalAmount: number;
  products: SaleProduct[];
}

export interface SaleProduct {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  salePrice: number;
  sale: Sale;
  product: Product;
}
