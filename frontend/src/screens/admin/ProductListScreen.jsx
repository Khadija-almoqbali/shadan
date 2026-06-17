import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Form } from 'react-bootstrap';

import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from 'react-icons/fa';

import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSclice';

import '../../assets/styles/orderListProductAdmin.css';
import { useTranslation } from 'react-i18next';

const ProductListScreen = () => {
  const { t, i18n } = useTranslation();

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

  // ✅ multilingual helper (FIXED)
  const getText = (field) => {
    if (!field) return '';

    const lang = i18n.language; // ar / en

    if (typeof field === 'string') return field;

    return field?.[lang] || field?.en || field?.ar || '';
  };

  const deleteHandler = async (id) => {
    if (window.confirm(t('productList.confirmDelete'))) {
      try {
        await deleteProduct(id);
        toast.success(t('productList.deleted'));
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm(t('productList.confirmCreate'))) {
      try {
        await createProduct();
        toast.success(t('productList.created'));
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredProducts = products?.filter((product) => {
    const name = getText(product.name).toLowerCase();
    const category = getText(product.category).toLowerCase();
    const brand = getText(product.brand).toLowerCase();

    const keyword = searchTerm.toLowerCase();

    return (
      name.includes(keyword) ||
      category.includes(keyword) ||
      brand.includes(keyword)
    );
  });

  return (
    <>
      {/* HEADER */}
      <div className="lux-page-header">
        <div>
          <h1 className="lux-title">{t('productList.title')}</h1>
          <p className="lux-subtitle">{t('productList.subtitle')}</p>
        </div>

        <div className="lux-page-header-right">
          <div className="lux-search">
            <Form.Control
              type="text"
              placeholder={t('productList.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="lux-create-btn" onClick={createProductHandler}>
            <FaPlus />
            {t('productList.create')}
          </Button>
        </div>
      </div>

      {/* STATS */}
      {!isLoading && products && (
        <div className="lux-stats-row">
          <div className="lux-stat-card">
            <span className="lux-stat-number">{products.length}</span>
            <span className="lux-stat-label">{t('productList.total')}</span>
          </div>

          <div className="lux-stat-card">
            <span className="lux-stat-number">
              {[...new Set(products.map((p) => getText(p.category)))].length}
            </span>
            <span className="lux-stat-label">{t('productList.categories')}</span>
          </div>

          <div className="lux-stat-card">
            <span className="lux-stat-number">
              {[...new Set(products.map((p) => getText(p.brand)))].length}
            </span>
            <span className="lux-stat-label">{t('productList.brands')}</span>
          </div>
        </div>
      )}

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
          <h3>{t('productList.emptyTitle')}</h3>
          <p>{t('productList.emptyDesc')}</p>
        </div>
      ) : (
        <Table hover responsive className="lux-table align-middle">
          <thead>
            <tr>
              <th>{t('productList.id')}</th>
              <th>{t('productList.name')}</th>
              <th>{t('productList.price')}</th>
              <th>{t('productList.category')}</th>
              <th>{t('productList.brand')}</th>
              <th className="text-end">{t('productList.actions')}</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts?.map((product) => (
              <tr key={product._id}>
                <td className="text-muted small">
                  {product._id.slice(-6)}
                </td>

                <td className="fw-semibold">
                  {getText(product.name)}
                </td>

                <td className="price-text">
                  ${product.price}
                </td>

                <td>
                  <span className="lux-badge">
                    {getText(product.category)}
                  </span>
                </td>

                <td>{getText(product.brand)}</td>

                <td className="text-end">
                  <div className="actions">
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button className="btn-sm lux-edit-btn">
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    <Button
                      className="btn-sm lux-delete-btn"
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
      )}
    </>
  );
};

export default ProductListScreen;