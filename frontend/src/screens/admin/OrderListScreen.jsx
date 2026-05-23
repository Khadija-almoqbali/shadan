import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import '../../assets/styles/adminOrderList.css';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((x) => x !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const filteredOrders = orders?.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🧾 PDF (UNCHANGED)
  const generateBill = () => {
    const doc = new jsPDF();

    selectedOrders.forEach((id, index) => {
      const order = orders.find((o) => o._id === id);
      if (!order) return;

      if (index !== 0) doc.addPage();

      let y = 15;

      doc.setFontSize(16);
      doc.text('INVOICE', 14, y);

      y += 10;

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

      doc.text(`Order ID: ${order._id}`, 14, y);

      y += 7;
      doc.text(`Date: ${order.createdAt.substring(0, 10)}`, 14, y);

      y += 10;

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
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [58, 31, 26] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.text(`TOTAL: ${order.totalPrice} OMR`, 14, finalY);

      doc.setFontSize(9);
      doc.text('Thank you for your order :)', 14, finalY + 10);
    });

    doc.save('invoices.pdf');
  };

  return (
    <>
      {/* HEADER */}
      <div className="lux-header">
        <div>
          <h1 className="lux-title">Orders</h1>
          <p className="lux-subtitle">Manage and export all orders</p>
        </div>

        <div className="lux-search">
          <Form.Control
            type="text"
            placeholder="Search orders (ID / user)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 🧾 BUTTON (MOVED ABOVE CARDS) */}
      <Button
        className="mb-3 lux-bill-btn"
        disabled={selectedOrders.length === 0}
        onClick={generateBill}
      >
        Generate Invoices (PDF)
      </Button>

      {/* STATS */}
      {!isLoading && orders && (
        <div className="stats-wrapper">
          <div className="stats-card simple">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>

          <div className="stats-card simple">
            <h3>{orders.filter(o => o.isPaid).length}</h3>
            <p>Paid Orders</p>
          </div>

          <div className="stats-card simple">
            <h3>{selectedOrders.length}</h3>
            <p>Selected for Invoice</p>
          </div>
        </div>
      )}

      

      {/* CONTENT */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="lux-table-wrapper">
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
              {filteredOrders?.map((order) => (
                <tr key={order._id} className="lux-row">
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
                      <FaTimes style={{ color: '#d11a2a' }} />
                    )}
                  </td>

                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: '#d11a2a' }} />
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
        </div>
      )}
    </>
  );
};

export default OrderListScreen;