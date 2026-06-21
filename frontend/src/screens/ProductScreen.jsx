import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import Rating from "../components/Rating";
import Meta from "../components/Meta";
import Loader from "../components/Loader";
import Message from "../components/Message";

import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSclice";

import { addToCart } from "../slices/cartSlice";
import "../assets/styles/productScreen.css";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const lang = i18n.language || "en";

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [
    createReview,
    { isLoading: loadingProductReview },
  ] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // 🔥 FIX: multilingual safe helper
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[lang] || field?.en || field?.ar || "";
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {/* BACK */}
      <Link className="back-btn mb-4 d-inline-block" to="/">
        {t("product.back")}
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {/* META */}
          <Meta title={getText(product?.name)} />

          <Row>
            {/* IMAGE */}
            <Col md={5}>
              <Image
                src={product.image}
                alt={getText(product?.name)}
                fluid
              />
            </Col>

            {/* INFO */}
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{getText(product?.name)}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  {t("product.price")}: OMR{" "}
                  {product.price?.toFixed(2) || "0.00"}
                </ListGroup.Item>

                <ListGroup.Item>
                  {t("product.description")}:{" "}
                  {getText(product?.description)}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* BUY */}
            <Col md={3}>
              <Card className="custom-card">
                <ListGroup variant="flush">

                  <ListGroup.Item>
                    <Row>
                      <Col>{t("product.price")}:</Col>
                      <Col>
                        <strong>
                          OMR {product.price?.toFixed(2) || "0.00"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* ✅ FIXED MULTILINGUAL STATUS */}
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("product.status")}:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? t("product.inStock")
                          : t("product.outOfStock")}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>{t("product.qty")}</Col>
                        <Col>
                          <Form.Select
                            value={qty}
                            onChange={(e) =>
                              setQty(Number(e.target.value))
                            }
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="d-grid">
                    <Button
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      {t("product.addToCart")}
                    </Button>
                  </ListGroup.Item>

                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* REVIEWS */}
          <Row className="review-section">
            <Col md={6} className="review-container">

              <h2 className="review-title">
                {t("product.reviews")}
              </h2>

              {product.reviews?.length === 0 && (
                <Message>{t("product.noReviews")}</Message>
              )}

              <ListGroup variant="flush">

                {product.reviews?.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>

                    <Rating value={review.rating} />

                    <p>{review.createdAt?.substring(0, 10)}</p>

                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>{t("product.writeReview")}</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>

                      <Form.Group controlId="rating">
                        <Form.Label>
                          {t("product.rating")}
                        </Form.Label>
                        <Form.Select
                          value={rating}
                          onChange={(e) =>
                            setRating(Number(e.target.value))
                          }
                        >
                          <option value="">
                            {t("product.select")}
                          </option>
                          <option value="1">1 - {t("product.poor")}</option>
                          <option value="2">2 - {t("product.fair")}</option>
                          <option value="3">3 - {t("product.good")}</option>
                          <option value="4">4 - {t("product.veryGood")}</option>
                          <option value="5">5 - {t("product.excellent")}</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>
                          {t("product.comment")}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }
                        />
                      </Form.Group>

                      <Button type="submit">
                        {t("product.submit")}
                      </Button>

                    </Form>
                  ) : (
                    <Message>
                      {t("product.loginMessage")}{" "}
                      <Link to="/login">
                        {t("product.login")}
                      </Link>
                    </Message>
                  )}
                </ListGroup.Item>

              </ListGroup>

            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;