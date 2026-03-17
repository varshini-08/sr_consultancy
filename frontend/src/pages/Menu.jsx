import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/products/categories');
                setCategories(['All', ...data]);
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
            (filterCategory === 'All' || product.category === filterCategory) &&
            (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <div className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
            {/* Header section */}
            <div className="menu-page-header">
                <h1 className="menu-page-title">Explore Our Menu</h1>
                <p className="menu-page-subtitle" style={{ marginBottom: 0, color: 'white' }}>Freshly prepared, beautifully crafted just for you.</p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-wrapper">
                <FaSearch className="search-icon-svg" />
                <input
                    type="text"
                    className="search-bar-input"
                    placeholder="Search for your favorite item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Filter */}
            <div className="category-filter-container">
                {categories.map(cat => (
                    <div
                        key={cat}
                        className={`category-badge ${filterCategory === cat ? 'active' : ''}`}
                        onClick={() => setFilterCategory(cat)}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            {/* Products Grid */}
            <div className="products-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '30px'
            }}>
                {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No items found.</h3>
                    <p>Try adjusting your search or category filter.</p>
                </div>
            )}
        </div>
    );
};

export default Menu;
