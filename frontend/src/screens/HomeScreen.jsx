import { useEffect, useState } from 'react';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import Product from '../components/product';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-screen">

      {/* Products Section */}
      <Container id="products" className="products-section">
        <div className="section-header">
          <h2>Latest Products</h2>
          <span className="section-underline" />
        </div>

        {loading ? (
          <div className="loading-container">
            <Spinner animation="border" style={{ color: '#3A1F1A' }} />
          </div>
        ) : products.length === 0 ? (
          <p className="no-products">No products available.</p>
        ) : (
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default HomeScreen;
