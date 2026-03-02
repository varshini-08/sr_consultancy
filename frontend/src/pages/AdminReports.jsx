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
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminReports = () => {
    const [monthlyData, setMonthlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyRes = await api.get('/analytics/daily');
                setDailyData(dailyRes.data);

                const monthlyRes = await api.get('/analytics/monthly');
                setMonthlyData(monthlyRes.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchData();
    }, []);

    // Placeholder data for graphs if real history not available
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 15000, 22000, 24000, monthlyData ? monthlyData.totalRevenue : 25000],
                borderColor: 'rgb(210, 105, 30)',
                backgroundColor: 'rgba(210, 105, 30, 0.5)',
            },
        ],
    };

    const pieChartData = {
        labels: monthlyData ? monthlyData.topSellingItems.map(i => i.name) : ['Cake', 'Coffee', 'Puff', 'Juice', 'Burger'],
        datasets: [
            {
                label: '# of Votes',
                data: monthlyData ? monthlyData.topSellingItems.map(i => i.quantity) : [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Reports & Analytics</h2>

            {dailyData && (
                <div style={{ marginBottom: '2rem', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px' }}>
                    <h3>Daily Profit & Loss ({new Date(dailyData.date).toLocaleDateString()})</h3>
                    <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                        <div>
                            <p>Revenue</p>
                            <h4 style={{ color: 'green' }}>+ ₹{dailyData.totalRevenue}</h4>
                        </div>
                        <div>
                            <p>Est. Expenses</p>
                            <h4 style={{ color: 'red' }}>- ₹{dailyData.estimatedExpenses.toFixed(2)}</h4>
                        </div>
                        <div>
                            <p>Net Profit</p>
                            <h4 style={{ color: dailyData.netProfit >= 0 ? 'green' : 'red' }}>
                                ₹{dailyData.netProfit.toFixed(2)}
                            </h4>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '15px' }}>Sales Trend</h3>
                    <Line options={{ responsive: true }} data={lineChartData} />
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '15px' }}>Category Distribution</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={pieChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
