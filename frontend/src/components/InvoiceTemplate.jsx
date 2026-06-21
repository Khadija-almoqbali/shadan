import React from 'react'

const InvoiceTemplate = React.forwardRef(({ orders, selectedOrders }, ref) => {
  const tEn = (key) => {
    const enMap = {
      "orders.invoice": "INVOICE",
      "orders.name": "Name",
      "orders.phone": "Phone",
      "orders.address": "Address",
      "orders.city": "City",
      "orders.country": "Country",
      "orders.deliveryType": "Delivery Type",
      "orders.officePickup": "Office Pickup",
      "orders.homeDelivery": "Home Delivery",
      "orders.orderId": "Order ID",
      "orders.date": "Date",
      "orders.product": "Product",
      "orders.qty": "Qty",
      "orders.price": "Price",
      "orders.total": "Total",
      "orders.thanks": "Thank you for your order",
    };

    return enMap[key] || key;
  };

  const getOrder = (id) => orders.find((o) => o._id === id);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {selectedOrders.map((id, index) => {
        const order = getOrder(id);
        if (!order) return null;

        return (
          <div
            key={id}
            style={{
              pageBreakAfter: "always",
              direction: "ltr",
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            {/* HEADER */}
            <h2 style={{ marginBottom: "10px" }}>
              {tEn("orders.invoice")}
            </h2>

            {/* INFO */}
            <div style={{ marginBottom: "20px", fontSize: "14px" }}>
              <p><b>{tEn("orders.name")}:</b> {order.user?.name || "-"}</p>
              <p><b>{tEn("orders.phone")}:</b> {order.shippingAddress?.phoneNumber || "-"}</p>
              <p><b>{tEn("orders.address")}:</b> {order.shippingAddress?.address || "-"}</p>
              <p><b>{tEn("orders.city")}:</b> {order.shippingAddress?.city || "-"}</p>
              <p><b>{tEn("orders.country")}:</b> {order.shippingAddress?.country || "-"}</p>
              <p>
                <b>{tEn("orders.deliveryType")}:</b>{" "}
                {order.shippingAddress?.deliveryType === "office"
                  ? tEn("orders.officePickup")
                  : tEn("orders.homeDelivery")}
              </p>
              <p><b>{tEn("orders.orderId")}:</b> {order._id}</p>
              <p><b>{tEn("orders.date")}:</b> {order.createdAt.substring(0, 10)}</p>
            </div>

            {/* TABLE */}
            <table
              width="100%"
              border="1"
              cellPadding="8"
              style={{ borderCollapse: "collapse", marginBottom: "20px" }}
            >
              <thead>
                <tr style={{ background: "#3a1f1a", color: "white" }}>
                  <th>{tEn("orders.product")}</th>
                  <th>{tEn("orders.qty")}</th>
                  <th>{tEn("orders.price")}</th>
                  <th>{tEn("orders.total")}</th>
                </tr>
              </thead>

              <tbody>
                {order.orderItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>{(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTAL */}
            <h3>
              Total: {order.totalPrice} OMR
            </h3>

            <p style={{ marginTop: "10px" }}>
              {tEn("orders.thanks")}
            </p>
          </div>
        );
      })}
    </div>
  );

});

export default InvoiceTemplate;