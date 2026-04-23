import {Row, Col} from 'react-bootstrap';
import products from '../products';
import Product from '../components/product';

const HomeScreen = () => {
  return (
    <div>
        <h1 className="text-center my-4">Latest Products</h1>
        <Row>
            {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            ))}
        </Row>
    </div>
  )
}

export default HomeScreen
