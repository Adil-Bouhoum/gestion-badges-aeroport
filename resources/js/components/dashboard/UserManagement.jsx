import React, { useEffect, useState } from 'react';
import { userService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const emptyUser = {
  name: '',
  email: '',
  fonction: '',
  service: '',
  password: '',
  is_active: true,
  is_admin: false,
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(emptyUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { logout, user: currentAdmin } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentUser(emptyUser);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser({ ...user, password: '' });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setActionLoading(true);
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setActionLoading(true);
      
      if (isEditMode) {
        await userService.update(currentUser.id, currentUser);
      } else {
        await userService.create(currentUser);
      }
      
      setModalOpen(false);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
      console.error('Error saving user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Prevent editing the current admin user
  const isCurrentAdmin = (userId) => currentAdmin?.id === userId;

  return (
    <div className="container py-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2 className="text-primary fw-bold text-secondary">User Management</h2>
    <button className="btn btn-outline-danger" onClick={logout}>
      Logout
    </button>
  </div>

  <button 
    className="btn btn-primary mb-3" 
    onClick={openAddModal} 
    style={{ backgroundColor: '#002366', borderColor: '#002366' }}
  >
    Add User
  </button>

  {loading ? (
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : error ? (
    <div className="alert alert-danger">{error}</div>
  ) : (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead style={{ backgroundColor: '#002366', color: '#fff' }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Function</th>
            <th>Service</th>
            <th>Active</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.fonction}</td>
              <td>{u.service}</td>
              <td>{u.is_active ? 'Yes' : 'No'}</td>
              <td>{u.is_admin ? 'Yes' : 'No'}</td>
              <td>
                <button 
                  className="btn btn-sm btn-warning me-2" 
                  onClick={() => openEditModal(u)} 
                  disabled={actionLoading || isCurrentAdmin(u.id)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(u.id)} 
                  disabled={actionLoading || isCurrentAdmin(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? 'Edit User' : 'Add User'}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setModalOpen(false)}
                  disabled={actionLoading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input 
                    name="name" 
                    className="form-control" 
                    value={currentUser.name} 
                    onChange={handleChange} 
                    required 
                    disabled={actionLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={currentUser.email} 
                    onChange={handleChange} 
                    required 
                    disabled={actionLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Function</label>
                  <input 
                    name="fonction" 
                    className="form-control" 
                    value={currentUser.fonction} 
                    onChange={handleChange} 
                    disabled={actionLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Service</label>
                  <input 
                    name="service" 
                    className="form-control" 
                    value={currentUser.service} 
                    onChange={handleChange} 
                    disabled={actionLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    {isEditMode ? 'New Password (leave blank to keep)' : 'Password'}
                  </label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    value={currentUser.password} 
                    onChange={handleChange} 
                    autoComplete="new-password" 
                    disabled={actionLoading}
                    required={!isEditMode}
                  />
                </div>
                <div className="form-check mb-3">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    className="form-check-input" 
                    checked={currentUser.is_active} 
                    onChange={handleChange} 
                    id="isActiveCheck" 
                    disabled={actionLoading}
                  />
                  <label className="form-check-label" htmlFor="isActiveCheck">Active</label>
                </div>
                <div className="form-check mb-3">
                  <input 
                    type="checkbox" 
                    name="is_admin" 
                    className="form-check-input" 
                    checked={currentUser.is_admin} 
                    onChange={handleChange} 
                    id="isAdminCheck" 
                    disabled={actionLoading}
                  />
                  <label className="form-check-label" htmlFor="isAdminCheck">Admin</label>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  {isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;