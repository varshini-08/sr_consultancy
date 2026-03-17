import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { FaDownload, FaChartLine, FaChartPie, FaRupeeSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const AdminReports = () => {
    const [monthlyData, setMonthlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyRes = await api.get('/analytics/daily');
                setDailyData(dailyRes.data);

                const monthlyRes = await api.get('/analytics/monthly');
                setMonthlyData(monthlyRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const downloadExcel = async () => {
        try {
            const response = await api.get('/analytics/export-orders', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders_report_${new Date().toLocaleDateString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading excel:', error);
            alert('Failed to download report');
        }
    };

    const premiumColors = {
        primary: '#d2691e', // Chocolate/Cinnamon
        secondary: '#5d4037', // Deep Brown
        accent: '#27ae60', // Emerald Green
        danger: '#e74c3c', // Soft Red
        bg: '#fdfbf7', // Cream
        chart: [
            'rgba(210, 105, 30, 0.7)',
            'rgba(93, 64, 55, 0.7)',
            'rgba(39, 174, 96, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(155, 89, 182, 0.7)',
        ]
    };

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Monthly Revenue',
                data: [12000, 19000, 15000, 22000, 24000, monthlyData ? monthlyData.totalRevenue : 25000],
                borderColor: premiumColors.primary,
                backgroundColor: 'rgba(210, 105, 30, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: premiumColors.primary,
                pointBorderWidth: 2,
            },
        ],
    };

    const hasTopItems = monthlyData && monthlyData.topSellingItems && monthlyData.topSellingItems.length > 0;

    const pieChartData = {
        labels: hasTopItems ? monthlyData.topSellingItems.map(i => i.name) : ['Cake', 'Coffee', 'Puff', 'Juice', 'Burger'],
        datasets: [
            {
                label: 'Items Sold',
                data: hasTopItems ? monthlyData.topSellingItems.map(i => i.quantity) : [12, 19, 3, 5, 2],
                backgroundColor: premiumColors.chart,
                borderColor: 'white',
                borderWidth: 2,
            },
        ],
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading analytics...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', color: premiumColors.secondary, margin: 0 }}>Business Analytics</h2>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Monitor your bakery's performance and performance trends.</p>
                </div>
                <button
                    onClick={downloadExcel}
                    style={{
                        padding: '12px 25px',
                        backgroundColor: premiumColors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 12px rgba(210, 105, 30, 0.2)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#b35d1a'}
                    onMouseOut={(e) => e.target.style.backgroundColor = premiumColors.primary}
                >
                    <FaDownload /> Export Report (Excel)
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Daily Revenue" value={`₹${dailyData?.totalRevenue || 0}`} icon={<FaChartLine color={premiumColors.accent} />} trend="+12%" />
                <StatCard title="Net Profit" value={`₹${dailyData?.netProfit.toFixed(0) || 0}`} icon={<FaRupeeSign color={premiumColors.primary} />} trend="+5.4%" />
                <StatCard title="Active Orders" value="24" icon={<FaChartLine color="#3498db" />} trend="+2" isCount />
                <StatCard title="New Customers" value="8" icon={<FaChartLine color="#9b59b2" />} trend="+3" isCount />
            </div>

            {dailyData && (
                <div style={{
                    marginBottom: '30px',
                    padding: '25px',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    borderLeft: `5px solid ${premiumColors.accent}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px 0', color: premiumColors.secondary }}>Financial Overview (Today)</h3>
                        <p style={{ margin: 0, color: '#95a5a6' }}>Summary of income and estimated operational costs.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <SummaryItem label="Income" value={`₹${dailyData.totalRevenue}`} color={premiumColors.accent} icon={<FaArrowUp />} />
                        <SummaryItem label="Expenses" value={`₹${dailyData.estimatedExpenses.toFixed(0)}`} color={premiumColors.danger} icon={<FaArrowDown />} />
                        <SummaryItem label="Profit" value={`₹${dailyData.netProfit.toFixed(0)}`} color={premiumColors.primary} />
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ marginBottom: '25px', color: premiumColors.secondary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChartLine color={premiumColors.primary} /> Revenue Statistics
                    </h3>
                    <Line
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                                x: { grid: { display: false } }
                            }
                        }}
                        data={lineChartData}
                    />
                </div>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ marginBottom: '25px', color: premiumColors.secondary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChartPie color={premiumColors.primary} /> Best Sellers
                    </h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Pie
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
                                }
                            }}
                            data={pieChartData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, isCount }) => (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
        <div>
            <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '0.9rem' }}>{title}</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>{value}</h3>
            <span style={{ fontSize: '0.8rem', color: '#27ae60', fontWeight: 'bold' }}>{trend} {isCount ? 'this week' : 'vs last month'}</span>
        </div>
        <div style={{ backgroundColor: '#fdfbf7', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {icon}
        </div>
    </div>
);

const SummaryItem = ({ label, value, color, icon }) => (
    <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '0.85rem' }}>{label}</p>
        <h4 style={{ margin: 0, fontSize: '1.3rem', color: color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
            {icon} {value}
        </h4>
    </div>
);

export default AdminReports;
