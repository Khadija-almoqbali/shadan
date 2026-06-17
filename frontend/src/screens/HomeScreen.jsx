import { Row, Col, Container, Form, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import Product from '../components/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSclice';
import { useTranslation } from "react-i18next";
import '../assets/styles/homeScreen.css';

const HomeScreen = () => {
  const { t } = useTranslation();

  const { data: products = [], isLoading, error } = useGetProductsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  // 🔥 helper to support multilingual safely
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field.en || field.ar || "";
  };

  // 🔥 FIXED FILTER (no crash + multilingual)
  const filteredProducts = products.filter((product) => {
    const name = getText(product.name).toLowerCase();
    const keyword = searchTerm.toLowerCase();

    return name.includes(keyword);
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="home-screen" id="products">
          <Container className="products-section">

            {/* HEADER */}
            <div className="collection-header">
              <p className="collection-subtitle">
                {t("home.subtitle")}
              </p>

              <h1 className="collection-title">
                {t("home.title")}
              </h1>

              <div className="collection-divider"></div>

              <p className="collection-description">
                {t("home.description")}
              </p>
            </div>

            {/* SEARCH */}
            <div className="products-toolbar">
              <Form.Control
                type="text"
                placeholder={t("home.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </div>

            {/* EMPTY STATE */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <h4>{t("home.noItems")}</h4>
                <p>{t("home.trySearch")}</p>
              </div>
            ) : (
              <>
                <Row className="g-4">
                  {currentProducts.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <Pagination>
                      {[...Array(totalPages).keys()].map((x) => (
                        <Pagination.Item
                          key={x + 1}
                          active={x + 1 === currentPage}
                          onClick={() => changePage(x + 1)}
                        >
                          {x + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination>
                  </div>
                )}
              </>
            )}

          </Container>
        </div>
      )}
    </>
  );
};

export default HomeScreen;