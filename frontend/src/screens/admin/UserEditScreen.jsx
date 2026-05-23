import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation
} from "../../slices/usersApiSlice";

import "../../assets/styles/userEdeitScreen.css";

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  

  const { data: user,refetch, isLoading, error } =
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
        await updateUser({userId, name, email, isAdmin});
        toast.success('User updated successfuly');
        refetch();
        navigate('/admin/userlist');
    } catch (err) {
        toast.error(err?.data?.message || err.error);
    }
  };


  return (
    <div className="lux-edit-wrapper">
      <div className="lux-edit-card">

        <Link to="/admin/userlist" className="btn btn-light mb-4">
          ← Go Back
        </Link>

        <h1 className="lux-title">Edit User</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            {/* NAME */}
            <Form.Group controlId="name" className="mb-4">
              <Form.Label className="lux-label">
                Full Name
              </Form.Label>

              <Form.Control
                className="lux-input"
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group controlId="email" className="mb-4">
              <Form.Label className="lux-label">
                Email Address
              </Form.Label>

              <Form.Control
                className="lux-input"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* ADMIN */}
            <Form.Group
              controlId="isAdmin"
              className="lux-check-wrapper mb-4"
            >
              <Form.Check
                type="checkbox"
                label="Administrator Access"
                checked={isAdmin}
                onChange={(e) =>
                  setIsAdmin(e.target.checked)
                }
              />
            </Form.Group>

            {/* BUTTON */}
            <Button type="submit" className="lux-btn">
              Update User
            </Button>

          </Form>
        )}
      </div>
    </div>
  );
};

export default UserEditScreen;