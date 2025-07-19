import React from "react";
import { Modal, Form, Input, InputNumber, Row, Col, Button } from "antd";
import type { Customer } from "~/utils/interfaces";

interface SubmitResponse {
  error?: string;
  [key: string]: any;
}

interface CustomerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Customer) => SubmitResponse | Promise<SubmitResponse> | void;
}

const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { day, month, year } = values;

      if (!day || !month || !year) {
        throw new Error("Por favor ingrese una fecha completa");
      }

      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1800) {
        throw new Error("Los valores de fecha no son válidos.");
      }

      const formattedDate = new Date(`${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T00:00:00`);

      const customerData = { ...values, birthDate: formattedDate };

      delete customerData.day;
      delete customerData.month;
      delete customerData.year;

      const response = await onSubmit(customerData);
      if (response?.error) {
        console.error("Error al crear el cliente:", response.error);
        alert(`Error: ${response.error}`);
      }
      form.resetFields();
    } catch (errorInfo) {
      console.log("Error en la validación de los campos:", errorInfo);
    }
  };

  return (
    <Modal
      title="Crear Cliente"
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="createCustomerForm">
        <Form.Item
          label="Nombre"
          name="firstName"
          rules={[{ required: true, message: "Por favor ingrese el nombre del cliente" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="lastName"
          rules={[{ required: true, message: "Por favor ingrese el apellido del cliente" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="C.I."
          name="ci"
          rules={[
            { required: true, message: "Por favor ingrese el C.I." },
            { min: 6, message: "El C.I. debe tener al menos 6 caracteres" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Por favor ingrese el email del cliente" },
            { type: "email", message: "Por favor ingrese un email válido" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="phoneNumber"
          rules={[
            { required: true, message: "Por favor ingrese el teléfono del cliente" },
            { len: 8, message: "El teléfono debe tener exactamente 8 dígitos" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="NIT"
          name="nit"
          rules={[
            { required: true, message: "Por favor ingrese el NIT" },
            { min: 6, message: "El NIT debe tener al menos 6 caracteres" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Fecha de Nacimiento">
          <Row gutter={8}>
            <Col span={7}>
              <Form.Item
                name="day"
                rules={[
                  { required: true, message: "Por favor ingrese el día" },
                  { type: "number", min: 1, max: 31, message: "Día inválido" },
                ]}
              >
                <InputNumber placeholder="Día" min={1} max={31} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item
                name="month"
                rules={[
                  { required: true, message: "Por favor ingrese el mes" },
                  { type: "number", min: 1, max: 12, message: "Mes inválido" },
                ]}
              >
                <InputNumber placeholder="Mes" min={1} max={12} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item
                name="year"
                rules={[
                  { required: true, message: "Por favor ingrese el año" },
                  { type: "number", min: 1800, message: "El año debe ser mayor a 1800" },
                ]}
              >
                <InputNumber placeholder="Año" min={1800} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerCreateModal;
