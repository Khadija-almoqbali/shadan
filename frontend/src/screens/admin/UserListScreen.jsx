import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Form } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import {toast} from 'react-toastify';
import '../../assets/styles/UserListScreen.css';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const { data: orders } = useGetOrdersQuery();
  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();
  

  const [searchTerm, setSearchTerm] = useState('');

  const deleteHandler = async(id) => {
    if(window.confirm('Are you sure?')){
        try {
            await deleteUser(id);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserPhone = (userId) => {
  const userOrders = orders?.filter(
            (order) => order.user?._id === userId
        );

        if (!userOrders?.length) return '-';

        // آخر order
        const lastOrder = userOrders[userOrders.length - 1];

        return lastOrder?.shippingAddress?.phoneNumber || '-';
        };

  return (
    <>
      {/* Header */}
      <div className="lux-header">
        <div>
          <h1 className="lux-title">Users Management</h1>
          <p className="lux-subtitle">
            Manage and monitor all registered users
          </p>
        </div>

        <div className="lux-search">
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      {!isLoading && users && (
        <div className="stats-wrapper">
          <div className="stats-card simple">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>

          <div className="stats-card simple">
            <h3>{users.filter((u) => u.isAdmin).length}</h3>
            <p>Admins</p>
          </div>
        </div>
      )}

      {loadingDelete && <Loader/>}

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table hover responsive className="lux-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PHONE</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers?.map((user, index) => (
              <tr key={user._id}>

                <td>{user._id.slice(-6)}</td>

                <td>{user.name}</td>

                <td>
                {getUserPhone(user._id)}
                </td>

                <td>
                  <a href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                </td>

                <td>
                  {user.isAdmin ? (
                    <span className="role-badge admin">
                      ADMIN
                    </span>
                  ) : (
                    <span className="role-badge user">
                      USER
                    </span>
                  )}
                </td>

                <td>
                  <div className="actions">
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button className="btn-sm lux-edit-btn">
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    <Button
                      className="btn-sm lux-delete-btn"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;