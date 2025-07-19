import React from "react";
import { Modal, Form, Input, InputNumber } from "antd";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; price: number; quantity: number }) => void;
}

const ProductCreateModal: React.FC<ProductCreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  return (
    <Modal
      title="Crear Producto"
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="createProductForm">
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Por favor ingrese el nombre del producto" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: "Por favor ingrese la descripción" }]}
        >
          <Input.TextArea placeholder="Descripción del producto" rows={4} />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="price"
          rules={[{ required: true, message: "Por favor ingrese el precio" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="Precio del producto" />
        </Form.Item>

        <Form.Item
          label="Cantidad"
          name="quantity"
          rules={[{ required: true, message: "Por favor ingrese la cantidad" }]}
        >
          <InputNumber min={1} step={1} style={{ width: "100%" }} placeholder="Cantidad del producto" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductCreateModal;
