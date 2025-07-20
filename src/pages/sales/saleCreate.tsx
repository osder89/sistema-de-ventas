"use client";
import React, { useState } from "react";
import { Button, Table, Input, Row, Col, message, InputNumber, Card, Space, Typography, Modal } from "antd";
import { SearchOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Navbar from "~/components/Navbar";
import type { Product, CarItem } from "~/utils/interfaces";
import { useRouter } from "next/navigation";

const { Text, Title } = Typography;

const SaleCreatePage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CarItem[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [creatingSale, setCreatingSale] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  const handleSearchCustomer = async () => {
    const ci = customerSearchTerm.trim();
    if (!ci) {
      message.warning("Ingrese CI");
      return;
    }
    setLoadingCustomer(true);
    try {
      const response = await fetch(`/api/customer/ci/${encodeURIComponent(ci)}`);
      const data = await response.json();
      if (response.ok) setCustomer(data.customer);
      else {
        setCustomer(null);
        message.error(data.error ?? "Cliente no encontrado.");
      }
    } catch {
      message.error("Error al buscar el cliente.");
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleSearchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`/api/product?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      if (response.ok) setProductList(data.products);
      else message.error(data.error ?? "No se encontraron productos.");
    } catch {
      message.error("Error al buscar productos.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddProduct = (product: Product) => {
    const stock = product.quantity;
    if (stock <= 0) {
      message.warning("El producto no tiene stock disponible.");
      return;
    }
    setCartItems(curr => {
      const existing = curr.find(p => p.id === product.id);
      if (!existing) {
        return [
          ...curr,
          {
            id: product.id,
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            stock,
            quantity: 1
          }
        ];
      }
      if (existing.quantity >= existing.stock) {
        message.warning("Alcanzaste el stock disponible.");
        return curr;
      }
      return curr.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
    });
  };

  const handleRemoveProduct = (id: number) => {
    setCartItems(items => items.filter(p => p.id !== id));
  };

  const handleQuantityChange = (value: number | string, productId: number) => {
    if (value === "") {
      setCartItems(items => items.map(p => p.id === productId ? { ...p, quantity: 1 } : p));
      return;
    }
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
      message.warning("Cantidad inválida.");
      return;
    }
    setCartItems(items =>
      items.map(p => {
        if (p.id !== productId) return p;
        if (value > p.stock) {
          message.warning("No hay tanto stock disponible.");
          return { ...p, quantity: p.stock };
        }
        return { ...p, quantity: value };
      })
    );
  };

  const handleCreateSale = async () => {
    if (cartItems.length === 0) {
      message.error("Agregue productos.");
      return;
    }
    if (!customer?.id) {
      message.error("Seleccione un cliente.");
      return;
    }
    for (const p of cartItems) {
      if (p.quantity > p.stock) {
        message.error(`La cantidad de ${p.name} excede el stock.`);
        return;
      }
    }
    const saleData = {
      customerId: customer.id,
      totalAmount: cartItems.reduce((acc, p) => acc + p.price * p.quantity, 0),
      products: cartItems.map(p => ({
        productId: p.id,
        quantity: p.quantity,
        salePrice: p.price
      }))
    };
    setCreatingSale(true);
    try {
      const response = await fetch("/api/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData)
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems([]);
        setSuccessOpen(true);
      } else {
        message.error(data.error ?? "Error al crear la venta.");
      }
    } catch {
      message.error("Error al crear la venta.");
    } finally {
      setCreatingSale(false);
    }
  };

  const total = cartItems.reduce((acc, p) => acc + p.price * p.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6a1b9a] to-[#4a148c] pb-10">
      <Navbar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px 0" }}>
        <Title level={3} style={{ color: "#fff", textAlign: "center", marginBottom: 32 }}>
          Nota de Venta
        </Title>
        <Row gutter={32} align="top">
          <Col xs={24} md={7} style={{ marginBottom: 32 }}>
            <Card title="Cliente" bordered={false} style={{ borderRadius: 12 }} headStyle={{ fontWeight: 600 }}>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Input
                  placeholder="CI del cliente"
                  value={customerSearchTerm}
                  onChange={e => setCustomerSearchTerm(e.target.value)}
                  onPressEnter={handleSearchCustomer}
                  suffix={<SearchOutlined />}
                />
                <Button
                  type="primary"
                  onClick={handleSearchCustomer}
                  loading={loadingCustomer}
                  icon={<SearchOutlined />}
                  style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a" }}
                >
                  Buscar
                </Button>
                <div style={{ marginTop: 8 }}>
                  <Space direction="vertical" size={6} style={{ width: "100%" }}>
                    <div>
                      <Text strong>Nombre Completo:</Text>
                      <div>{customer ? `${customer.firstName ?? customer.name ?? ""} ${customer.lastName ?? customer.surname ?? ""}` : "—"}</div>
                    </div>
                    <div>
                      <Text strong>CI:</Text>
                      <div>{customer ? customer.ci : "—"}</div>
                    </div>
                    <div>
                      <Text strong>NIT:</Text>
                      <div>{customer?.nit ?? "—"}</div>
                    </div>
                    <div>
                      <Text strong>Teléfono:</Text>
                      <div>{customer?.phoneNumber ?? customer?.phone ?? "—"}</div>
                    </div>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={17}>
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }} bodyStyle={{ paddingBottom: 8 }} title="Buscar Productos">
              <Row gutter={12}>
                <Col flex="auto">
                  <Input
                    placeholder="Nombre o código"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onPressEnter={handleSearchProducts}
                    suffix={<SearchOutlined />}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={handleSearchProducts}
                    loading={loadingProducts}
                    icon={<SearchOutlined />}
                    style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a" }}
                  >
                    Buscar
                  </Button>
                </Col>
              </Row>
            </Card>
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 0 }} title="Resultados" headStyle={{ padding: "12px 16px" }}>
              <Table
                size="small"
                columns={[
                  { title: "Producto", dataIndex: "name", key: "name" },
                  { title: "Precio", dataIndex: "price", key: "price", render: (v: number) => v.toFixed(2) },
                  { title: "Stock", dataIndex: "quantity", key: "quantity" },
                  {
                    title: "Acción",
                    key: "action",
                    render: (_: any, record: Product) => (
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddProduct(record)}
                        style={{ color: "#6a1b9a", padding: 0 }}
                      >
                        Agregar
                      </Button>
                    )
                  }
                ]}
                dataSource={productList}
                rowKey="id"
                pagination={false}
              />
            </Card>
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 0 }} title="Carrito" headStyle={{ padding: "12px 16px" }}>
              <Table
                size="small"
                columns={[
                  { title: "Producto", dataIndex: "name", key: "name" },
                  {
                    title: "Cantidad",
                    key: "quantity",
                    render: (_: any, record: CarItem) => (
                      <InputNumber
                        min={1}
                        max={record.stock}
                        step={1}
                        value={record.quantity}
                        onChange={value => handleQuantityChange(value!, record.id)}
                        style={{ width: "100%" }}
                      />
                    )
                  },
                  { title: "Precio", dataIndex: "price", key: "price", render: (v: number) => v.toFixed(2) },
                  {
                    title: "Disponible",
                    key: "available",
                    render: (_: any, r: CarItem) => r.stock - r.quantity
                  },
                  {
                    title: "SubTotal",
                    key: "subtotal",
                    render: (_: any, r: CarItem) => (r.price * r.quantity).toFixed(2)
                  },
                  {
                    title: "Acción",
                    key: "action",
                    render: (_: any, r: CarItem) => (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveProduct(r.id)}
                        style={{ color: "#e74c3c", padding: 0 }}
                      />
                    )
                  }
                ]}
                dataSource={cartItems}
                rowKey="id"
                pagination={false}
              />
            </Card>
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
                <Title level={4} style={{ margin: 0, color: "#4a148c" }}>
                  Total: {total} Bs
                </Title>
                <Button
                  type="primary"
                  onClick={handleCreateSale}
                  disabled={!customer?.id || cartItems.length === 0 || creatingSale}
                  loading={creatingSale}
                  style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a", fontWeight: "bold", color: "#ffffff" }}
                >
                  Confirmar Venta
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        open={successOpen}
        onOk={() => { setSuccessOpen(false); router.push("/sales"); }}
        onCancel={() => { setSuccessOpen(false); router.push("/sales"); }}
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        title="Venta exitosa"
      >
        <p>La venta se registró correctamente.</p>
      </Modal>
    </div>
  );
};

export default SaleCreatePage;
