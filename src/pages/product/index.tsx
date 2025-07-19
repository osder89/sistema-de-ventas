import React, { useState, useEffect } from "react";
import { Button, Pagination } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import ProductTable from "~/components/product/ProductTable";
import ProductCreateModal from "~/components/product/ProductCreateModal";
import ProductEditModal from "~/components/product/ProductEditModal";
import Navbar from "~/components/Navbar";
import type { Product } from "~/utils/interfaces";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchProducts = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/product?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    setProducts(data.products);
  };

  const handleDelete = async (id: number) => {
  const response = await fetch(`/api/product/${id}`, {
    method: "DELETE",  
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  if (response.ok) {
    fetchProducts(page, pageSize);
  } else {
    console.error("Error eliminando producto:", data.error);
  }
};

  const handleCreateProduct = async (productData: {
    name: string;
    description: string;
    price: number;
    quantity: number;
  }) => {
    await fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    setIsModalOpen(false);
    fetchProducts(page, pageSize);
  };

  const handleEditProduct = async (productData: Product) => {
    if (!productData.id) {
      console.error("ID del producto no encontrado");
      return;
    }

    await fetch(`/api/product/${productData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    setIsEditModalOpen(false);
    fetchProducts(page, pageSize);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
    fetchProducts(page, pageSize);
  };

  const handleEdit = (id: number) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6a1b9a] to-[#4a148c] pt-20">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Listado de Productos</h1>

        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<PlusOutlined />}
            size="large"
            className="rounded-lg"
          >
            Agregar Producto
          </Button>
        </div>

        <ProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <ProductCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProduct}
        />

        <ProductEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProduct}
          product={editingProduct}
        />

        <Pagination
          current={page}
          pageSize={pageSize}
          total={products.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "30", "50"]}
        />
      </div>
    </div>
  );
};

export default ProductPage;
