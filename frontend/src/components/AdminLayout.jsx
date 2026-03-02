import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const sidebarItems = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/orders', icon: <FaClipboardList />, label: 'Orders' },
        { path: '/admin/products', icon: <FaBoxOpen />, label: 'Menu Management' }, // Assuming this route exists or will exist
        { path: '/admin/reports', icon: <FaChartBar />, label: 'Reports' },
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
    ];

    return (
        <div className="admin-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fdfbf7' }}>
            {/* Sidebar */}
            <div className="admin-sidebar" style={{
                width: '260px',
                backgroundColor: '#5d4037',
                color: '#ecf0f1',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 1000,
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                        <FaBoxOpen size={24} color="#e74c3c" />
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>SR Bakery</h2>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '2rem 1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {sidebarItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link to={item.path} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    color: isActive(item.path) ? '#5d4037' : '#ecf0f1',
                                    backgroundColor: isActive(item.path) ? '#fdfbf7' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    fontWeight: isActive(item.path) ? 'bold' : 'normal'
                                }}>
                                    <span style={{ marginRight: '12px', fontSize: '1.1rem' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <FaUserCircle size={36} style={{ marginRight: '10px', color: '#ccc' }} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{user?.name || 'Admin'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#bbb' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid #e74c3c',
                        color: '#e74c3c',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e74c3c'; }}
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="admin-content" style={{
                flex: 1,
                marginLeft: '260px',
                padding: '2rem',
                backgroundColor: '#f8f9fa' // Slightly different background for content area
            }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
