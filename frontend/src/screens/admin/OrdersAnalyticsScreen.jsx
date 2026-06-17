import { useState } from "react";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Form, Card } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "../../assets/styles/ordersAnalytics.css";

const OrdersAnalyticsScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [selectedMonth, setSelectedMonth] = useState("all");

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.error}
      </Message>
    );

  const monthlyMap = {};

  orders.forEach((order) => {
    const month = order.createdAt.substring(0, 7);

    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, revenue: 0, orders: 0 };
    }

    monthlyMap[month].revenue += Number(order.totalPrice || 0);
    monthlyMap[month].orders += 1;
  });

  let chartData = Object.values(monthlyMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  if (selectedMonth !== "all") {
    chartData = chartData.filter((m) => m.month === selectedMonth);
  }

  const months = Object.keys(monthlyMap);

  return (
    <div className="analytics-page">

  <h2 className="analytics-title">📊 Orders Analytics</h2>

  {/* FILTER */}
  <Card className="analytics-filter-card">
    <Form.Select
      className="analytics-select"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      <option value="all">All Months</option>
      {months.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </Form.Select>
  </Card>

  {/* CHART */}
  <Card className="analytics-chart-card">
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#c9a227"
          strokeWidth={2}
          name="Revenue (OMR)"
        />

        <Line
          type="monotone"
          dataKey="orders"
          stroke="#5a2e27"
          strokeWidth={2}
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>

  {/* SUMMARY */}
  <Card className="analytics-summary">
    <h5>Summary</h5>

    {chartData.map((m) => (
      <div className="analytics-summary-item" key={m.month}>
        <span>{m.month}</span>
        <span>
          {m.revenue.toFixed(2)} OMR ({m.orders})
        </span>
      </div>
    ))}
  </Card>

</div>
  );
};

export default OrdersAnalyticsScreen;