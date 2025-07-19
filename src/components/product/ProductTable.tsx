import React, { useState } from "react";
import { Button, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Product } from "~/utils/interfaces";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onDelete, onEdit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setProductToDelete(id);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete !== null) {
      onDelete(productToDelete);
    }
    setIsModalVisible(false);
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Product) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record.id)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Confirmar eliminación"
        visible={isModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Eliminar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
      </Modal>
    </>
  );
};

export default ProductTable;
