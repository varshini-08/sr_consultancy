import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaTrash, FaUserShield, FaUserPlus } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Playfair Display', color: '#5d4037', margin: 0 }}>User Management</h2>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#7f8c8d' }}>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Role</th>
                                <th style={{ padding: '15px' }}>Joined Date</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{user.name}</td>
                                    <td style={{ padding: '15px', color: '#34495e' }}>{user.email}</td>
                                    <td style={{ padding: '15px' }}>
                                        {user.role === 'admin' ? (
                                            <span style={{ backgroundColor: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                <FaUserShield size={12} /> Admin
                                            </span>
                                        ) : (
                                            <span style={{ backgroundColor: '#ecf0f1', color: '#7f8c8d', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem' }}>
                                                Customer
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '15px', color: '#7f8c8d' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                title="Delete User"
                                                style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                                                <FaTrash size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
