import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Form } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetUsersQuery,
  useDeleteUserMutation
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import '../../assets/styles/UserListScreen.css';

const UserListScreen = () => {
  const { t } = useTranslation();

  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const { data: orders } = useGetOrdersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState('');

  const deleteHandler = async (id) => {
    if (window.confirm(t('userList.confirmDelete'))) {
      try {
        await deleteUser(id);
        refetch();
        toast.success(t('userList.deleted'));
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

    const lastOrder = userOrders[userOrders.length - 1];

    return lastOrder?.shippingAddress?.phoneNumber || '-';
  };

  return (
    <>
      {/* HEADER */}
      <div className="lux-page-header">
        <div>
          <h1 className="lux-title">{t('userList.title')}</h1>
          <p className="lux-subtitle">{t('userList.subtitle')}</p>
        </div>

        <div className="lux-search">
          <Form.Control
            type="text"
            placeholder={t('userList.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      {!isLoading && users && (
        <div className="stats-wrapper">
          <div className="stats-card simple">
            <h3>{users.length}</h3>
            <p>{t('userList.total')}</p>
          </div>

          <div className="stats-card simple">
            <h3>{users.filter((u) => u.isAdmin).length}</h3>
            <p>{t('userList.admins')}</p>
          </div>
        </div>
      )}

      {loadingDelete && <Loader />}

      {/* TABLE */}
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
              <th>{t('userList.id')}</th>
              <th>{t('userList.name')}</th>
              <th>{t('userList.phone')}</th>
              <th>{t('userList.email')}</th>
              <th>{t('userList.role')}</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user._id}>

                <td>{user._id.slice(-6)}</td>

                <td>{user.name}</td>

                <td>{getUserPhone(user._id)}</td>

                <td>
                  <a href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                </td>

                <td>
                  {user.isAdmin ? (
                    <span className="role-badge admin">
                      {t('userList.admin')}
                    </span>
                  ) : (
                    <span className="role-badge user">
                      {t('userList.user')}
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