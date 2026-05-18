import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery } from '../../slices/productsApiSclice';
import '../../assets/styles/orderListProductAdmin.css'


const ProductListScreen = () => {
    const {data: products, isLoading, error} = useGetProductsQuery();

    const deleteHandler = (id) => {
        console.log(id);
    }

  return (
    <>
  {/* HEADER */}
  <div className="lux-header">
    <Row className="align-items-center mb-4">
      <Col>
        <h2 className="lux-title">Products</h2>
        <p className="lux-subtitle">Manage your store products</p>
      </Col>

      <Col className="text-end">
        <Button className="lux-create-btn">
          <FaEdit className="me-2" />
          Create Product
        </Button>
      </Col>
    </Row>
  </div>

  {/* CONTENT */}
  {isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div className="lux-table-wrapper">
      <Table hover responsive className="lux-table align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th className="text-end">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="lux-row">
              <td className="text-muted small">{product._id.slice(-6)}</td>
              <td className="fw-semibold">{product.name}</td>
              <td className="text-success fw-bold">
                ${product.price}
              </td>
              <td>
                <span className="lux-badge">{product.category}</span>
              </td>
              <td>{product.brand}</td>

              <td className="text-end lux-action-cell">
                <div className="lux-actions">
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button className="lux-action-btn lux-edit">
                        <FaEdit />
                    </Button>
                    </LinkContainer>

                    <Button
                    className="lux-action-btn lux-delete"
                    onClick={() => deleteHandler(product._id)}
                    >
                    <FaTrash />
                    </Button>
                </div>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )}
</>
  )
}

export default ProductListScreen
