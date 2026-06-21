import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import "../../assets/styles/adminOrderList.css";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const OrderListScreen = () => {
  const { t} = useTranslation();

  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((x) => x !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const filteredOrders = orders?.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupByMonth = (ordersList = []) => {
    return ordersList.reduce((acc, order) => {
      const month = order.createdAt?.substring(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(order);
      return acc;
    }, {});
  };

  const groupedOrders = groupByMonth(filteredOrders || []);

  const invoiceRef = useRef();

const generateBill = useReactToPrint({
  content: () => invoiceRef.current,
  documentTitle: "invoices",
});

  return (
    <>
      {/* HEADER */}
      <div className="lux-page-header">
        <div>
          <h1 className="lux-title">{t("orders.title")}</h1>
          <p className="lux-subtitle">{t("orders.subtitle")}</p>
        </div>

        <div className="lux-search">
          <Form.Control
            type="text"
            placeholder={t("orders.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTON */}
      <Button
        className="mb-3 lux-bill-btn floating-bill-btn"
        disabled={selectedOrders.length === 0}
        onClick={generateBill}
      >
        {t("orders.generatePdf")}
      </Button>

      {/* STATS */}
      {!isLoading && orders && (
        <div className="stats-wrapper">
          <div className="stats-card simple">
            <h3>{orders.length}</h3>
            <p>{t("orders.totalOrders")}</p>
          </div>

          <div className="stats-card simple">
            <h3>{orders.filter((o) => o.isPaid).length}</h3>
            <p>{t("orders.paidOrders")}</p>
          </div>

          <div className="stats-card simple">
            <h3>{selectedOrders.length}</h3>
            <p>{t("orders.selected")}</p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        Object.entries(groupedOrders)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([month, monthOrders]) => (
            <div key={month} style={{ marginBottom: "40px" }}>
              <h3 style={{ margin: "15px 0" }}>
                📅 {month}
              </h3>

              <Table hover responsive className="lux-table">
                <thead>
                  <tr>
                    <th>{t("orders.select")}</th>
                    <th>{t("orders.id")}</th>
                    <th>{t("orders.user")}</th>
                    <th>{t("orders.date")}</th>
                    <th>{t("orders.total")}</th>
                    <th>{t("orders.coupon")}</th>
                    <th>{t("orders.discount")}</th>
                    <th>{t("orders.paid")}</th>
                    <th>{t("orders.delivered")}</th>
                    <th>{t("orders.delivery")}</th>
                    <th>{t("orders.details")}</th>
                  </tr>
                </thead>

                <tbody>
                  {monthOrders.map((order) => (
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

                      <td>{order.couponCode || "-"}</td>

                      <td>
                        {order.discount
                          ? `${order.discount.toFixed(2)} OMR`
                          : "-"}
                      </td>

                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "#d11a2a" }} />
                        )}
                      </td>

                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "#d11a2a" }} />
                        )}
                      </td>

                      <td>
                        {order.shippingAddress?.deliveryType === "office"
                          ? t("orders.office")
                          : t("orders.home")}
                      </td>

                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm" variant="light">
                            {t("orders.detailsBtn")}
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))
      )}
    </>
  );
};

export default OrderListScreen;