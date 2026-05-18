import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {FaTimes} from 'react-icons/fa'
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import {useGetMyOrdersQuery} from '../slices/ordersApiSlice';
import { LinkContainer } from 'react-router-bootstrap';
import '../assets/styles/profile.css'; 

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation();

    const {data: orders, isLoading, error} = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
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
            toast.success('Profile updated successfully');

            setPassword('');
            setConfirmPassword('');
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
                    <h2 className="profile-title">User Profile</h2>

                    <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                className="lux-input"
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='my-2'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                className="lux-input"
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='my-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                className="lux-input"
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='my-2'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                className="lux-input"
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button type='submit' className="lux-btn w-100 my-3">
                            Update Profile
                        </Button>

                        {loadingUpdateProfile && <Loader />}
                    </Form>
                </div>
            </Col>

            {/* ORDERS */}
            <Col md={8}>
                <div className="profile-card">
                    <h2 className="profile-title">My Orders</h2>

                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>
                            {error?.data?.message || error.error}
                        </Message>
                    ) : (
                        <Table responsive className="lux-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
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
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button size="sm" variant="light">
                                        Details
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