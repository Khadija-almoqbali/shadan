import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSclice";

import "../../assets/styles/productEditLuxury.css";

const ProductEditScreen = () => {
  const { t } = useTranslation();

  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState({ en: "", ar: "" });
  const [description, setDescription] = useState({ en: "", ar: "" });
  const [brand, setBrand] = useState({ en: "", ar: "" });
  const [category, setCategory] = useState({ en: "", ar: "" });

  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const { data: product, isLoading, error } =
    useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(
        typeof product.name === "object"
          ? product.name
          : { en: product.name || "", ar: product.name || "" }
      );

      setDescription(
        typeof product.description === "object"
          ? product.description
          : { en: product.description || "", ar: product.description || "" }
      );

      setBrand(
        typeof product.brand === "object"
          ? product.brand
          : { en: product.brand || "", ar: product.brand || "" }
      );

      setCategory(
        typeof product.category === "object"
          ? product.category
          : { en: product.category || "", ar: product.category || "" }
      );

      setPrice(product.price || 0);
      setImage(product.image || "");
      setCountInStock(product.countInStock || 0);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      _id: productId,

      name: {
        en: name.en || "",
        ar: name.ar || name.en || "",
      },

      description: {
        en: description.en || "",
        ar: description.ar || description.en || "",
      },

      brand: {
        en: brand.en || "",
        ar: brand.ar || brand.en || "",
      },

      category: {
        en: category.en || "",
        ar: category.ar || category.en || "",
      },

      price,
      image,
      countInStock,
    };

    try {
      await updateProduct(updatedProduct).unwrap();
      toast.success(t("adminProductEdit.updatedSuccess"));
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
          {t("ui.goBack")}
        </Link>

        <h1 className="lux-title">{t("adminProductEdit.title")}</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            {/* NAME EN */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.nameEn")}</Form.Label>
              <Form.Control
                className="lux-input"
                value={name.en}
                onChange={(e) =>
                  setName({ ...name, en: e.target.value })
                }
              />
            </Form.Group>

            {/* NAME AR */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.nameAr")}</Form.Label>
              <Form.Control
                className="lux-input"
                value={name.ar}
                onChange={(e) =>
                  setName({ ...name, ar: e.target.value })
                }
              />
            </Form.Group>

            {/* PRICE */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.price")}</Form.Label>
              <Form.Control
                type="number"
                className="lux-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            {/* IMAGE */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.image")}</Form.Label>

              <Form.Control
                className="lux-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
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

            {/* BRAND EN */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.brandEn")}</Form.Label>
              <Form.Control
                className="lux-input"
                value={brand.en}
                onChange={(e) =>
                  setBrand({ ...brand, en: e.target.value })
                }
              />
            </Form.Group>

            {/* BRAND AR */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.brandAr")}</Form.Label>
              <Form.Control
                className="lux-input"
                value={brand.ar}
                onChange={(e) =>
                  setBrand({ ...brand, ar: e.target.value })
                }
              />
            </Form.Group>

            {/* CATEGORY EN */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.categoryEn")}</Form.Label>
              <Form.Control
                className="lux-input"
                value={category.en}
                onChange={(e) =>
                  setCategory({ ...category, en: e.target.value })
                }
              />
            </Form.Group>

            {/* CATEGORY AR */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.categoryAr")}</Form.Label>
              <Form.Control
                className="lux-input"
                value={category.ar}
                onChange={(e) =>
                  setCategory({ ...category, ar: e.target.value })
                }
              />
            </Form.Group>

            {/* DESCRIPTION EN */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.descriptionEn")}</Form.Label>
              <Form.Control
                as="textarea"
                className="lux-input"
                value={description.en}
                onChange={(e) =>
                  setDescription({ ...description, en: e.target.value })
                }
              />
            </Form.Group>

            {/* DESCRIPTION AR */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.descriptionAr")}</Form.Label>
              <Form.Control
                as="textarea"
                className="lux-input"
                value={description.ar}
                onChange={(e) =>
                  setDescription({ ...description, ar: e.target.value })
                }
              />
            </Form.Group>

            {/* STOCK */}
            <Form.Group className="mb-3">
              <Form.Label>{t("adminProductEdit.stock")}</Form.Label>
              <Form.Control
                type="number"
                className="lux-input"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Button className="lux-btn" type="submit">
              {t("adminProductEdit.updateBtn")}
            </Button>

          </Form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;