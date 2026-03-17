import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaClock, FaSave } from 'react-icons/fa';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        storeName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        whatsappNumber: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: ''
        },
        openingHours: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            setSettings(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load settings');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setSettings(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/settings', settings);
            setSettings(data);
            toast.success('Settings updated successfully!');
        } catch (error) {
            console.error('Settings Update UI Error:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        }
    };

    const handleTestEmail = async () => {
        toast.info('Sending test email...');
        try {
            const { data } = await api.post('/settings/test-email');
            if (data.success) {
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Email test failed. Check settings and App Password.');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#5d4037', margin: 0 }}>Store Configuration</h2>
                <button
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: '#27ae60',
                        color: 'white',
                        padding: '12px 25px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 10px rgba(39, 174, 96, 0.3)'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    <FaSave /> Save Changes
                </button>
            </div>

            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', borderLeft: '5px solid #ffc107', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ margin: 0, color: '#856404' }}>Email Configuration Alert</h4>
                    <p style={{ margin: '5px 0 0 0', color: '#856404', fontSize: '0.9rem' }}>Verify your SMTP settings by sending a test email to {settings.contactEmail}.</p>
                </div>
                <button
                    onClick={handleTestEmail}
                    style={{ backgroundColor: '#ffc107', color: '#856404', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Send Test Email
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
                {/* General Settings */}
                <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#5d4037', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f9f9f9', paddingBottom: '10px' }}>
                        <FaStore color="#d2691e" /> Basic Information
                    </h3>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '500' }}>Store Name</label>
                            <div style={{ position: 'relative' }}>
                                <FaStore style={{ position: 'absolute', left: '12px', top: '12px', color: '#bdc3c7' }} />
                                <input
                                    type="text"
                                    name="storeName"
                                    value={settings.storeName}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '500' }}>Admin Email (Notifications)</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '12px', color: '#bdc3c7' }} />
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '500' }}>Contact Phone</label>
                            <div style={{ position: 'relative' }}>
                                <FaPhone style={{ position: 'absolute', left: '12px', top: '12px', color: '#bdc3c7' }} />
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={settings.contactPhone}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '500' }}>Shop Address</label>
                            <div style={{ position: 'relative' }}>
                                <FaMapMarkerAlt style={{ position: 'absolute', left: '12px', top: '12px', color: '#bdc3c7' }} />
                                <textarea
                                    name="address"
                                    value={settings.address}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '80px', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations & Social */}
                <div style={{ display: 'grid', gap: '30px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: '#5d4037', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f9f9f9', paddingBottom: '10px' }}>
                            <FaClock color="#d2691e" /> Business Hours & Support
                        </h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '500' }}>Opening Hours (Text Display)</label>
                                <div style={{ position: 'relative' }}>
                                    <FaClock style={{ position: 'absolute', left: '12px', top: '12px', color: '#bdc3c7' }} />
                                    <input
                                        type="text"
                                        name="openingHours"
                                        value={settings.openingHours}
                                        onChange={handleChange}
                                        placeholder="e.g. 9:00 AM - 10:00 PM"
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '500' }}>WhatsApp Business Number</label>
                                <div style={{ position: 'relative' }}>
                                    <FaWhatsapp style={{ position: 'absolute', left: '12px', top: '12px', color: '#25D366' }} />
                                    <input
                                        type="text"
                                        name="whatsappNumber"
                                        value={settings.whatsappNumber}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: '#5d4037', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f9f9f9', paddingBottom: '10px' }}>
                            <FaInstagram color="#d2691e" /> Social Media Links
                        </h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <FaFacebook style={{ position: 'absolute', left: '12px', top: '12px', color: '#1877F2' }} />
                                <input
                                    type="text"
                                    name="socialLinks.facebook"
                                    placeholder="Facebook URL"
                                    value={settings.socialLinks.facebook}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <FaInstagram style={{ position: 'absolute', left: '12px', top: '12px', color: '#E4405F' }} />
                                <input
                                    type="text"
                                    name="socialLinks.instagram"
                                    placeholder="Instagram URL"
                                    value={settings.socialLinks.instagram}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <FaTwitter style={{ position: 'absolute', left: '12px', top: '12px', color: '#1DA1F2' }} />
                                <input
                                    type="text"
                                    name="socialLinks.twitter"
                                    placeholder="Twitter URL"
                                    value={settings.socialLinks.twitter}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p style={{ textAlign: 'center', color: '#bdc3c7', marginTop: '40px', fontSize: '0.85rem' }}>
                SR Bakery Management System v2.0 • Last updated {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}
            </p>
        </div>
    );
};

export default AdminSettings;
