import { Row, Col, Container, Form, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import Product from '../components/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSclice';
import '../assets/styles/homeScreen.css';

const HomeScreen = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
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
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='home-screen' id="products">
          <Container className='products-section' >
            
            <div className='collection-header'>
              <p className='collection-subtitle'>
                TIMELESS ELEGANCE
              </p>

              <h1 className='collection-title'>
                Curated Collection
              </h1>

              <div className='collection-divider'></div>

              <p className='collection-description'>
                Discover a carefully curated selection of accessories
                designed to elevate every look with elegance,
                sophistication, and timeless beauty.
              </p>
            </div>

            <div className='products-toolbar'>
              <Form.Control
                type='text'
                placeholder='Search Collection'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // يرجع لأول صفحة عند البحث
                }}
                className='search-input'
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className='empty-state'>
                <h4>No Items Found</h4>
                <p>Try searching for another piece.</p>
              </div>
            ) : (
              <>
                <Row className='g-4'>
                  {currentProducts.map((product) => (
                    <Col
                      key={product._id}
                      sm={12}
                      md={6}
                      lg={4}
                      xl={3}
                    >
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='pagination-wrapper'>
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