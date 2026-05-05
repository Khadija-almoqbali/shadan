import { Row, Col, Container} from 'react-bootstrap';
import Product from '../components/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSclice';



const HomeScreen = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div className="home-screen">
          <Container id="products" className="products-section">
            <div className="section-header">
              <h2>Latest Products</h2>
              <span className="section-underline" />
            </div>

            {products.length === 0 ? (
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
      )}
    </>
  );
};

export default HomeScreen;