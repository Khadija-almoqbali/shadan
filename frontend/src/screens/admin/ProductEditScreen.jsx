import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation
} from "../../slices/productsApiSclice";

import "../../assets/styles/productEditLuxury.css";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const { data: product, isLoading, error } =
    useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

 

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    try {
      await updateProduct(updatedProduct).unwrap();

      toast.success("Product updated");

      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="lux-edit-wrapper">
      <div className="lux-edit-card">

        <Link to="/admin/productlist" className="btn btn-light mb-3">
          Go Back
        </Link>

        <h1 className="lux-title">Edit Product</h1>

        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>

            {/* NAME */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="lux-label">Name</Form.Label>
              <Form.Control
                className="lux-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* PRICE */}
            <Form.Group controlId="price" className="mb-3">
              <Form.Label className="lux-label">Price</Form.Label>
              <Form.Control
                className="lux-input"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            {/* IMAGE */}
            <Form.Group controlId="image" className="mb-3">
              <Form.Label className="lux-label">Image</Form.Label>

              <Form.Control
                className="lux-input"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image URL"
              />

              <Form.Control
                className="lux-input mt-2"
                type="file"
                onChange={uploadFileHandler}
              />
              {loadingUpload && <Loader />}

              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="lux-img-preview"
                />
              )}
            </Form.Group>

            {/* BRAND */}
            <Form.Group controlId="brand" className="mb-3">
              <Form.Label className="lux-label">Brand</Form.Label>
              <Form.Control
                className="lux-input"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            {/* STOCK */}
            <Form.Group controlId="countInStock" className="mb-3">
              <Form.Label className="lux-label">Stock</Form.Label>
              <Form.Control
                className="lux-input"
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            {/* CATEGORY */}
            <Form.Group controlId="category" className="mb-3">
              <Form.Label className="lux-label">Category</Form.Label>
              <Form.Control
                className="lux-input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            {/* DESCRIPTION */}
            <Form.Group controlId="description" className="mb-3">
              <Form.Label className="lux-label">Description</Form.Label>
              <Form.Control
                className="lux-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* BUTTON */}
            <Button type="submit" className="lux-btn">
              Update Product
            </Button>

          </Form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;