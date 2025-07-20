"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table, Tag, Space, Typography, Spin, Pagination } from "antd";
import type { SaleProduct, Product } from "~/utils/interfaces";

const { Text } = Typography;

interface Props {
  saleId: number | null;
  open: boolean;
  onClose: () => void;
}

interface SaleProductRow extends SaleProduct {
  product: Product;
}

interface ApiResponse {
  saleId: number;
  items: SaleProductRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const SaleDetailModal: React.FC<Props> = ({ saleId, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10; // usaremos nuestro tamaño local para paginar client-side

  useEffect(() => {
    if (!open || !saleId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/saleProduct/${saleId}?page=1&pageSize=1000`);
        const json = await res.json();
        if (res.ok && json.saleId) {
          setData(json as ApiResponse);
          setPage(1);
        } else {
          setData(null);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, saleId]);

  const items = data?.items || [];
  const totalItems = items.length;
  const sliceStart = (page - 1) * pageSize;
  const sliceEnd = sliceStart + pageSize;
  const pageItems = items.slice(sliceStart, sliceEnd);

  const columns = [
    { title: "Producto", dataIndex: ["product", "name"], key: "productName" },
    { title: "Descripción", dataIndex: ["product", "description"], key: "description" },
    { title: "Cantidad", dataIndex: "quantity", key: "quantity" },
    { title: "Precio", dataIndex: "salePrice", key: "salePrice", render: (v: number) => v.toFixed(2) },
    { title: "Subtotal", key: "subtotal", render: (_: any, r: SaleProductRow) => (r.salePrice * r.quantity).toFixed(2) }
  ];

  const totalCalc = items.reduce((acc, r) => acc + r.salePrice * r.quantity, 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Cerrar"
      cancelButtonProps={{ style: { display: "none" } }}
      title={data ? `Detalle Venta #${data.saleId}` : "Detalle Venta"}
      width={900}
    >
      {loading && <Spin />}
      {!loading && data && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space wrap>
            <Tag color="purple">Venta: {data.saleId}</Tag>
            <Tag color="green">Total: {totalCalc.toFixed(2)} Bs</Tag>
            <Tag color="blue">Ítems: {totalItems}</Tag>
          </Space>

            <Table
              size="small"
              columns={columns}
              dataSource={pageItems}
              rowKey="id"
              pagination={false}
            />

          {totalItems > pageSize && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                size="small"
                current={page}
                pageSize={pageSize}
                total={totalItems}
                onChange={p => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </Space>
      )}
      {!loading && !data && <Text>No se encontraron productos para esta venta.</Text>}
    </Modal>
  );
};

export default SaleDetailModal;
