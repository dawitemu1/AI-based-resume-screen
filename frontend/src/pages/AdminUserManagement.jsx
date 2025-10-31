import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'

const AdminUserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: null, userName: '' })
  const [editUserModal, setEditUserModal] = useState({ isOpen: false, user: null })
  const [newUserModal, setNewUserModal] = useState(false)
  const { alert, showAlert, dismissAlert } = useAlert()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  })

  // Simulate fetching users
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUsers = () => {
      // Simulated user data
      const userData = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
        { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user', status: 'active' },
        { id: 3, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
        { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive' },
      ]
      setUsers(userData)
      setFilteredUsers(userData)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(users)
      return
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    )
    
    setFilteredUsers(filtered)
  }

  const openDeleteDialog = (userId, userName) => {
    setDeleteDialog({ isOpen: true, userId, userName })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, userId: null, userName: '' })
  }

  const handleDeleteUser = () => {
    // In a real app, this would be an API call
    const updatedUsers = users.filter(user => user.id !== deleteDialog.userId)
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    closeDeleteDialog()
    showAlert('success', `User ${deleteDialog.userName} has been deleted`)
  }

  const handleToggleStatus = (userId) => {
    // In a real app, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    )
    
    setUsers(updatedUsers)
    
    // Also update filtered users
    const updatedFilteredUsers = filteredUsers.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    )
    
    setFilteredUsers(updatedFilteredUsers)
    
    const user = users.find(u => u.id === userId)
    showAlert('success', `User ${user.name} has been ${user.status === 'active' ? 'deactivated' : 'activated'}`)
  }

  const openEditUserModal = (user) => {
    setEditUserModal({ isOpen: true, user })
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    })
  }

  const closeEditUserModal = () => {
    setEditUserModal({ isOpen: false, user: null })
    setFormData({
      name: '',
      email: '',
      role: 'user'
    })
  }

  const handleEditUser = () => {
    // In a real app, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === editUserModal.user.id 
        ? { ...user, ...formData } 
        : user
    )
    
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    closeEditUserModal()
    showAlert('success', 'User updated successfully')
  }

  const openNewUserModal = () => {
    setNewUserModal(true)
    setFormData({
      name: '',
      email: '',
      role: 'user'
    })
  }

  const closeNewUserModal = () => {
    setNewUserModal(false)
    setFormData({
      name: '',
      email: '',
      role: 'user'
    })
  }

  const handleCreateUser = () => {
    // In a real app, this would be an API call
    const newUser = {
      id: users.length + 1,
      ...formData,
      status: 'active'
    }
    
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    closeNewUserModal()
    showAlert('success', 'User created successfully')
  }

  if (loading) {
    return <div className="admin-user-management">Loading users...</div>
  }

  return (
    <div className="admin-user-management">
      <header>
        <h1>User Management</h1>
        <button className="btn-primary" onClick={openNewUserModal}>Add New User</button>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Search users by name or email..." 
      />
      
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => openEditUserModal(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-toggle"
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => openDeleteDialog(user.id, user.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteDialog.userName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
      
      {/* Edit User Modal */}
      <Modal 
        isOpen={editUserModal.isOpen} 
        onClose={closeEditUserModal}
        title="Edit User"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleEditUser()
        }}>
          <div className="form-group">
            <label htmlFor="edit-name">Name:</label>
            <input
              id="edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-email">Email:</label>
            <input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-role">Role:</label>
            <select
              id="edit-role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeEditUserModal}>
              Cancel
            </button>
            <button type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
      
      {/* New User Modal */}
      <Modal 
        isOpen={newUserModal} 
        onClose={closeNewUserModal}
        title="Add New User"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleCreateUser()
        }}>
          <div className="form-group">
            <label htmlFor="new-name">Name:</label>
            <input
              id="new-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-email">Email:</label>
            <input
              id="new-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-role">Role:</label>
            <select
              id="new-role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeNewUserModal}>
              Cancel
            </button>
            <button type="submit">
              Create User
            </button>
          </div>
        </form>
      </Modal>
      
      <div className="back-link">
        <Link to="/admin">&larr; Back to Admin Dashboard</Link>
      </div>
    </div>
  )
}

export default AdminUserManagement