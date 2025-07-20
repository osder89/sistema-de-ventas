import React, { useState } from "react";
import { Button, Table, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { Sale } from "~/utils/interfaces";

interface SaleTableProps {
  sales: Sale[];
  onViewDetail: (id: number) => void;
}

const SaleTable: React.FC<SaleTableProps> = ({ sales, onViewDetail }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);

  const handleViewDetail = (id: number) => {
    onViewDetail(id);
  };

  const columns = [
    {
      title: "Número de Venta",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre del Cliente",
      dataIndex: "customer",
      key: "customer",
      render: (customer: { firstName: string; lastName: string }) =>
        `${customer.firstName} ${customer.lastName}`,
    },
    {
      title: "Monto Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount: number) => `$${totalAmount.toFixed(2)}`,
    },
    {
      title: "Fecha de Venta",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Sale) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
        >
          Ver Detalle
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={sales}
        rowKey="id"
        pagination={false}
      />
    </>
  );
};

export default SaleTable;
