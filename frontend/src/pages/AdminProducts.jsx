import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { uploadImage } from '../api/uploadService';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: '',
        description: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ name: '', category: '', price: '', stock: '', image: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setIsEditing(true);
        setCurrentProductId(product._id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image: product.image,
            description: product.description || ''
        });
        setImagePreview(product.image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProductId(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);
                const uploadRes = await uploadImage(uploadFormData);
                imageUrl = uploadRes.image;
            }

            const productData = { 
                ...formData, 
                image: imageUrl,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            if (isEditing) {
                await api.put(`/products/${currentProductId}`, productData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', productData);
                toast.success('Product added successfully');
            }
            closeModal();
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving product');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Playfair Display', color: '#5d4037', margin: 0 }}>Menu Management</h2>
                <button
                    onClick={openAddModal}
                    style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <FaPlus /> Add Product
                </button>
            </div>

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#7f8c8d' }}>
                                <th style={{ padding: '15px' }}>Image</th>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Category</th>
                                <th style={{ padding: '15px' }}>Price</th>
                                <th style={{ padding: '15px' }}>Stock</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{product.name}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem' }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', color: '#d35400', fontWeight: 'bold' }}>₹{product.price}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            color: product.stock > 10 ? '#27ae60' : '#e74c3c',
                                            fontWeight: 'bold'
                                        }}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => openEditModal(product)}
                                            style={{ background: 'transparent', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '10px' }}>
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '500px',
                        maxWidth: '90%',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#5d4037', fontFamily: 'Playfair Display' }}>
                                {isEditing ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7f8c8d' }}>
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                                    <input type="text" name="category" required value={formData.category} onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Stock</label>
                                    <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Price (₹)</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Product Image</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {imagePreview && (
                                        <div style={{ position: 'relative' }}>
                                            <img src={getImageUrl(imagePreview)} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: '5px', border: '1px solid #eee', backgroundColor: '#fdfdfd' }} />
                                            {imageFile && (
                                                <button 
                                                    type="button"
                                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                    style={{ position: 'absolute', top: '5px', right: '5px', padding: '5px', borderRadius: '50%', background: 'rgba(231, 76, 60, 0.8)', color: 'white', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <label style={{ 
                                            flex: 1, 
                                            padding: '10px', 
                                            border: '1px dashed #ccc', 
                                            borderRadius: '5px', 
                                            textAlign: 'center', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            color: '#7f8c8d'
                                        }}>
                                            <FaUpload /> {imageFile ? imageFile.name : 'Upload New Image'}
                                            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                                        </label>
                                        <input 
                                            type="text" 
                                            name="image" 
                                            placeholder="Or enter image URL" 
                                            value={formData.image} 
                                            onChange={handleInputChange}
                                            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={closeModal}
                                    style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={uploading}
                                    style={{ 
                                        padding: '10px 20px', 
                                        borderRadius: '5px', 
                                        border: 'none', 
                                        background: uploading ? '#ccc' : '#e74c3c', 
                                        color: 'white', 
                                        cursor: uploading ? 'not-allowed' : 'pointer', 
                                        fontWeight: 'bold' 
                                    }}>
                                    {uploading ? 'Processing...' : (isEditing ? 'Save Changes' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
