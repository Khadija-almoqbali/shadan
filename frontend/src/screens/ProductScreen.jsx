import { useParams } from "react-router-dom"
import {Link} from 'react-router-dom';
import {Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap';
import Rating from "../components/Rating";
import products from "../products"


const ProductScreen = () => {

    const {id: productId} = useParams();
    const product = products.find((p) => p._id === productId);
    console.log(product);

  return (
    <>
    <Link className="back-btn mb-4 d-inline-block" to='/'>
        ← Go Back
    </Link>

    <Row>
        <Col md={5}>
  <div className="image-wrapper">
    <Image src={product.image} alt={product.name} fluid />
  </div>
</Col>

        <Col md={4}>
        <div >
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                </ListGroup.Item>

                <ListGroup.Item>
                    Price: OMR {product.price.toFixed(2)}
                </ListGroup.Item>

                <ListGroup.Item>
                    Description: {product.description}
                </ListGroup.Item>
            </ListGroup>
        </div>
        </Col>
        

        <Col md={3}>
            <Card className="custom-card">
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <Row>
                            <Col>Price:</Col>
                            <Col><strong>OMR {product.price.toFixed(2)}</strong></Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Status:</Col>
                            <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                        </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item className="d-grid">
                        <Button type="button" disabled={product.countInStock === 0}>
                            Add to Cart
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
    </>
  )
}

export default ProductScreen
