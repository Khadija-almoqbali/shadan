import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation
} from "../../slices/usersApiSlice";

import "../../assets/styles/userEdeitScreen.css";

const UserEditScreen = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, refetch, isLoading, error } =
    useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser({ userId, name, email, isAdmin }).unwrap();

      toast.success(t("userEdit.updatedSuccess"));

      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="lux-edit-wrapper">
      <div className="lux-edit-card">

        {/* ❌ no common namespace */}
        <Link to="/admin/userlist" className="btn btn-light mb-4">
          ← {t("userEdit.back")}
        </Link>

        <h1 className="lux-title">{t("userEdit.title")}</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            <Form.Group className="mb-4">
              <Form.Label className="lux-label">
                {t("userEdit.fullName")}
              </Form.Label>

              <Form.Control
                className="lux-input"
                type="text"
                placeholder={t("userEdit.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="lux-label">
                {t("userEdit.email")}
              </Form.Label>

              <Form.Control
                className="lux-input"
                type="email"
                placeholder={t("userEdit.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="isAdmin" className="mb-4">
              <div className="lux-checkbox-row">
              <Form.Check
                inline
                type="checkbox"
                label={t("userEdit.adminAccess")}
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              </div>
            </Form.Group>

            <Button type="submit" className="lux-btn">
              {t("userEdit.updateBtn")}
            </Button>

          </Form>
        )}
      </div>
    </div>
  );
};

export default UserEditScreen;