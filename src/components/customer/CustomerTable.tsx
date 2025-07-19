import React, { useState } from "react";
import { Button, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Customer } from "~/utils/interfaces";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onDelete, onEdit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setCustomerToDelete(id);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete !== null) {
      onDelete(customerToDelete);
    }
    setIsModalVisible(false);
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      
    },
    {
      title: "Nombre",
      dataIndex: "firstName",
      key: "firstName",
      render: (text: string, record: Customer) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "C.I.",
      dataIndex: "ci",
      key: "ci",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Teléfono",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (birthDate: string) => new Date(birthDate).toLocaleDateString(),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Customer) => (
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
        dataSource={customers}
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
        <p>¿Estás seguro de que deseas eliminar este cliente?</p>
      </Modal>
    </>
  );
};

export default CustomerTable;
