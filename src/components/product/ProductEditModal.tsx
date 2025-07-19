import React from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import type { Product } from "~/utils/interfaces";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Product) => void;
  product: Product | null;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ isOpen, onClose, onSubmit, product }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      });
    }
  }, [product, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, id: product?.id });
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  return (
    <Modal
      title="Editar Producto"
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okText="Guardar Cambios"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="editProductForm">
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
          <InputNumber min={0} step={1} style={{ width: "100%" }} placeholder="Cantidad del producto" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductEditModal;
