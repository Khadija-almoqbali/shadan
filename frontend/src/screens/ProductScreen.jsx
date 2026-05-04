import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";

const ProductScreen = () => {
  const [product, setProduct] = useState({
    name: "",
    image: "",
    price: 0,
    description: "",
    rating: 0,
    numReviews: 0,
    countInStock: 0,
  });

  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  return (
    <>
      {/* 🔙 Back Button */}
      <Link className="back-btn mb-4 d-inline-block" to="/">
        ← Go Back
      </Link>

      <Row>
        {/* 🔹 Image */}
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        {/* 🔹 Product Info */}
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>

            <ListGroup.Item>
              Price: OMR {product.price ? product.price.toFixed(2) : '0.00'}
            </ListGroup.Item>

            <ListGroup.Item>
              Description: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* 🔹 Purchase Card */}
        <Col md={3}>
          <Card className="custom-card">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>
                      OMR {product.price ? product.price.toFixed(2) : '0.00'}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="d-grid">
                <Button
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;