import React, { useState, useEffect } from "react";
import { Button, Pagination } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import CustomerTable from "~/components/customer/CustomerTable";
import CustomerCreateModal from "~/components/customer/CustomerCreateModal";
import Navbar from "~/components/Navbar";
import type { Customer } from "~/utils/interfaces";
import CustomerEditModal from "~/components/customer/CustomerEditModal";

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCustomers = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/customer?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    setCustomers(data.customers);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/customer/${id}`, {
      method: "DELETE",  
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (response.ok) {
      fetchCustomers(page, pageSize);
    } else {
      console.error("Error eliminando cliente:", data.error);
    }
  };

  const handleCreateCustomer = async (customerData: {
    firstName: string;
    lastName: string;
    ci: string;
    phoneNumber: string;
    email: string;
    nit: string;
    birthDate: Date;
  }) => {
    await fetch("/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    setIsModalOpen(false);
    fetchCustomers(page, pageSize);
  };

  const handleEditCustomer = async (customerData: Customer) => {
    console.log("Editing customer:", customerData);
    if (!customerData.id) {
      console.error("ID del cliente no encontrado");
      return;
    }

    await fetch(`/api/customer/${customerData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    setIsEditModalOpen(false);
    fetchCustomers(page, pageSize);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
    fetchCustomers(page, pageSize);
  };

  const handleEdit = (id: number) => {
    const customerToEdit = customers.find(customer => customer.id === id);
    if (customerToEdit) {
      setEditingCustomer(customerToEdit);
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    fetchCustomers(page, pageSize);
  }, [page, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6a1b9a] to-[#4a148c] pt-20">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Listado de Clientes</h1>

        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<PlusOutlined />}
            size="large"
            className="rounded-lg"
          >
            Agregar Cliente
          </Button>
        </div>

        <CustomerTable
          customers={customers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <CustomerCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateCustomer}
        />

        <CustomerEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditCustomer}
          customer={editingCustomer}
        />

        <Pagination
          current={page}
          pageSize={pageSize}
          total={customers.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "30", "50"]}
        />
      </div>
    </div>
  );
};

export default CustomerPage;
