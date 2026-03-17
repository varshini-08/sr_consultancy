/**
 * Resolves a backend image path to a full URL.
 * @param {string} imagePath - The path stored in the database (e.g., /uploads/image.png)
 * @returns {string} - The full URL to the image
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL or data URI, return as is
    if (
        imagePath.startsWith('http') || 
        imagePath.startsWith('https://') || 
        imagePath.startsWith('data:') || 
        imagePath.startsWith('blob:')
    ) {
        return imagePath;
    }

    // Get base backend URL (strip /api if present)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
    const baseUrl = backendUrl.replace('/api', '');

    // Ensure imagePath starts with /
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${normalizedPath}`;
};
