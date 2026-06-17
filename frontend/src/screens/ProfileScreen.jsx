import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import "../assets/styles/profile.css";

const ProfileScreen = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("profilePage.passwordMismatch"));
      return;
    }

    try {
      const updateData = {
        _id: userInfo._id,
        name,
        email,
      };

      if (password) {
        updateData.password = password;
      }

      const res = await updateProfile(updateData).unwrap();

      dispatch(setCredentials(res));
      toast.success(t("profilePage.updatedSuccess"));

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="profile-wrapper">
      <Row>
        {/* PROFILE */}
        <Col md={4}>
          <div className="profile-card">
            <h2 className="profile-title">
              {t("profilePage.section")}
            </h2>

            <Form onSubmit={submitHandler}>
              <Form.Group className="my-2">
                <Form.Label>{t("profilePage.name")}</Form.Label>
                <Form.Control
                  className="lux-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="my-2">
                <Form.Label>{t("profilePage.email")}</Form.Label>
                <Form.Control
                  className="lux-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="my-2">
                <Form.Label>{t("profilePage.password")}</Form.Label>
                <Form.Control
                  className="lux-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="my-2">
                <Form.Label>
                  {t("profilePage.confirmPassword")}
                </Form.Label>
                <Form.Control
                  className="lux-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button
                type="submit"
                className="lux-btn w-100 my-3"
              >
                {t("profilePage.updateBtn")}
              </Button>

              {loadingUpdateProfile && <Loader />}
            </Form>
          </div>
        </Col>

        {/* ORDERS */}
        <Col md={8}>
          <div className="profile-card">
            <h2 className="profile-title">
              {t("profilePage.ordersTitle")}
            </h2>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <Table responsive className="lux-table">
                <thead>
                  <tr>
                    <th>{t("profilePage.id")}</th>
                    <th>{t("profilePage.date")}</th>
                    <th>{t("profilePage.total")}</th>
                    <th>{t("profilePage.paid")}</th>
                    <th>{t("profilePage.delivered")}</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt?.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>

                      <td>
                        {order.isPaid ? (
                          order.paidAt?.substring(0, 10)
                        ) : (
                          <FaTimes className="icon-fail" />
                        )}
                      </td>

                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt?.substring(0, 10)
                        ) : (
                          <FaTimes className="icon-fail" />
                        )}
                      </td>

                      <td>
                        <LinkContainer
                          to={`/order/${order._id}`}
                        >
                          <Button size="sm" variant="light">
                            {t("profilePage.details")}
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileScreen;