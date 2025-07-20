// pages/sales/index.tsx (o app/sales/page.tsx según tu estructura)
import React, { useState, useEffect } from "react";
import { Button, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Navbar from "~/components/Navbar";
import type { Sale } from "~/utils/interfaces";
import SaleTable from "~/components/sales/SalesTable";
import { useRouter } from "next/router";
import SaleDetailModal from "~/components/sales/SaleDetailModal";

const SalePage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSaleId, setDetailSaleId] = useState<number | null>(null);
  const router = useRouter();

  const fetchSales = async (p: number, ps: number) => {
    const response = await fetch(`/api/sale?page=${p}&pageSize=${ps}`);
    const data = await response.json();
    setSales(data.sales);
  };

  useEffect(() => {
    fetchSales(page, pageSize);
  }, [page, pageSize]);

  const handleViewDetail = (id: number) => {
    setDetailSaleId(id);
    setDetailOpen(true);
  };

  const handleAddSale = () => {
    router.push("/sales/saleCreate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6a1b9a] to-[#4a148c] pt-20">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Listado de Ventas</h1>
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            onClick={handleAddSale}
            icon={<PlusOutlined />}
            size="large"
            className="rounded-lg"
          >
            Agregar Venta
          </Button>
        </div>
        <SaleTable sales={sales} onViewDetail={handleViewDetail} />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={sales.length}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
          showSizeChanger
          pageSizeOptions={["10", "20", "30", "50"]}
        />
      </div>
      <SaleDetailModal
        saleId={detailSaleId}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};

export default SalePage;
