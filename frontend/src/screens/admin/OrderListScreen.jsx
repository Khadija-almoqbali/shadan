import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import '../../assets/styles/adminOrderList.css'

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log(orders);

  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((x) => x !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  // 🧾 PDF - each order in separate page
  const generateBill = () => {
  const doc = new jsPDF();

  selectedOrders.forEach((id, index) => {
    const order = orders.find((o) => o._id === id);
    if (!order) return;

    // 📄 صفحة جديدة لكل طلب (ما عدا الأول)
    if (index !== 0) doc.addPage();

    let y = 15;

    // 🏷️ العنوان
    doc.setFontSize(16);
    doc.text('INVOICE', 14, y);

    y += 10;

    // 👤 بيانات العميل
    doc.setFontSize(10);
    doc.text(`Name: ${order.user?.name || '-'}`, 14, y);

    y += 7;
    doc.text(`Phone: ${order.shippingAddress?.phoneNumber || '-'}`, 14, y);

    y += 7;
    doc.text(`Address: ${order.shippingAddress?.address || '-'}`, 14, y);

    y += 7;
    doc.text(`City: ${order.shippingAddress?.city || '-'}`, 14, y);

    y += 7;
    doc.text(`Country: ${order.shippingAddress?.country || '-'}`, 14, y);

    y += 10;

    // 📦 معلومات الطلب
    doc.text(`Order ID: ${order._id}`, 14, y);

    y += 7;
    doc.text(`Date: ${order.createdAt.substring(0, 10)}`, 14, y);

    y += 10;

    // 🧾 جدول المنتجات
    autoTable(doc, {
      startY: y,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: order.orderItems.map((item) => [
        item.name,
        item.qty,
        item.price,
        (item.qty * item.price).toFixed(2),
      ]),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [38, 6, 6], // بني فخم
      },
    });

    // 💰 الإجمالي
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`TOTAL: ${order.totalPrice} OMR`, 14, finalY);

    // ✨ footer
    doc.setFontSize(9);
    doc.text('Thank you for your order :)', 14, finalY + 10);
  });

  doc.save('invoices.pdf');
};

  return (
    <>
      <h1>Orders</h1>

<Button
  className="mb-3 lux-bill-btn"
  disabled={selectedOrders.length === 0}
  onClick={generateBill}
>
  Generate Invoices (PDF)
</Button>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table hover responsive className="lux-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelect(order._id)}
                  />
                </td>

                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>

                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm" variant="light">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;