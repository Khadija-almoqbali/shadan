import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Table,
  Button,
  Form,
} from 'react-bootstrap';

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBoxOpen,
} from 'react-icons/fa';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import { toast } from 'react-toastify';

import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSclice';

import '../../assets/styles/orderListProductAdmin.css';

const ProductListScreen = () => {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery();

  const [searchTerm, setSearchTerm] = useState('');

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id);

        toast.success('Product Deleted');

        refetch();
      } catch (err) {
        toast.error(
          err?.data?.message || err.error
        );
      }
    }
  };

  const createProductHandler = async () => {
    if (
      window.confirm(
        'Are you sure you want to create new product?'
      )
    ) {
      try {
        await createProduct();

        refetch();

        toast.success('Product Created');
      } catch (err) {
        toast.error(
          err?.data?.message || err.error
        );
      }
    }
  };

  const filteredProducts = products?.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.brand
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* HEADER */}
      <div className="lux-page-header">
        <div>
          <h1 className="lux-title">
            Products Management
          </h1>

          <p className="lux-subtitle">
            Manage and monitor store products
          </p>
        </div>

        <div className="lux-page-header-right">
          {/* SEARCH */}
          <div className="lux-search">
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {/* CREATE BUTTON */}
          <Button
            className="lux-create-btn"
            onClick={createProductHandler}
          >
            <FaPlus />
            Create Product
          </Button>
        </div>
      </div>

      {/* STATS */}
{!isLoading && products && (
  <div className="lux-stats-row">
    <div className="lux-stat-card">
      <span className="lux-stat-number">
        {products.length}
      </span>

      <span className="lux-stat-label">
        Total Products
      </span>
    </div>

    <div className="lux-stat-card">
      <span className="lux-stat-number">
        {
          [
            ...new Set(
              products.map((p) => p.category)
            ),
          ].length
        }
      </span>

      <span className="lux-stat-label">
        Categories
      </span>
    </div>

    <div className="lux-stat-card">
      <span className="lux-stat-number">
        {
          [
            ...new Set(
              products.map((p) => p.brand)
            ),
          ].length
        }
      </span>

      <span className="lux-stat-label">
        Brands
      </span>
    </div>
  </div>
)}
      {/* LOADERS */}
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {/* CONTENT */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : filteredProducts?.length === 0 ? (
        <div className="empty-state">
          <FaBoxOpen className="empty-icon" />

          <h3>No Products Found</h3>

          <p>
            Try searching with another keyword
          </p>
        </div>
      ) : (
        <Table
          hover
          responsive
          className="lux-table align-middle"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th className="text-end">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts?.map((product) => (
              <tr key={product._id}>
                <td className="text-muted small">
                  {product._id.slice(-6)}
                </td>

                <td className="fw-semibold">
                  {product.name}
                </td>

                <td className="price-text">
                  ${product.price}
                </td>

                <td>
                  <span className="lux-badge">
                    {product.category}
                  </span>
                </td>

                <td>{product.brand}</td>

                <td className="text-end">
                  <div className="actions">
                    <LinkContainer
                      to={`/admin/product/${product._id}/edit`}
                    >
                      <Button className="btn-sm lux-edit-btn">
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    <Button
                      className="btn-sm lux-delete-btn"
                      onClick={() =>
                        deleteHandler(product._id)
                      }
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;