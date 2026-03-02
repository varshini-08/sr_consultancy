import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/products/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setFilterCategory(categoryParam);
        }
    }, [location.search]);

    const filteredProducts = products.filter(product => {
        return (
            (filterCategory === '' || product.category === filterCategory) &&
            (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Menu</h2>

            {/* Filters */}
            <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '2rem', justifyContent: 'center' }}>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '300px' }}
                />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            <div className="products-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>No products found.</p>
            )}
        </div>
    );
};

export default Menu;
