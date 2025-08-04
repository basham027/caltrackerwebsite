
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (isAuthenticated === 'true') {
          setUser({
            name: localStorage.getItem('userName') || 'User',
            email: localStorage.getItem('userEmail') || 'user@example.com'
          });

          // Fetch dashboard data from API using POST
          const currentDate = new Date();
          
          const startDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            1, // day 1
            0, 0, 0, 0
          ));
          
          const endDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth() +1 , // next month
            1, // first day of next month
            0, 0, 0, 0
          ));
          
          
          const payload = {
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            includeCosts: "true"
          };

          const response = await fetch('https://getfirestoreusage-zbhi5gq6gq-uc.a.run.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            setError('Failed to fetch dashboard data');
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toLocaleString() || '0';
  };

  const formatCurrency = (amount) => {
    return amount ? `$${amount.toFixed(4)}` : '$0.0000';
  };

  // Generate sample daily data for the current month
  const generateDailyData = () => {
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDay = currentDate.getDate();
    
    const dailyLabels = [];
    const dailyOperations = [];
    const dailyCosts = [];
    
    for (let day = 1; day <= Math.min(currentDay, daysInMonth); day++) {
      dailyLabels.push(`${day}`);
      
      // Generate sample data based on actual operations (distributed daily)
      const operations = dashboardData?.report?.operations || {};
      const billing = dashboardData?.report?.billing?.actual || {};
      
      const dailyTotal = Math.floor((operations.request || 0) / currentDay * (0.8 + Math.random() * 0.4));
      const dailyCost = (billing.totalCost || 0) / currentDay * (0.8 + Math.random() * 0.4);
      
      dailyOperations.push(dailyTotal);
      dailyCosts.push(dailyCost);
    }
    
    return { dailyLabels, dailyOperations, dailyCosts };
  };

  const { dailyLabels, dailyOperations, dailyCosts } = dashboardData ? generateDailyData() : { dailyLabels: [], dailyOperations: [], dailyCosts: [] };

  const usageChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Daily Operations',
        data: dailyOperations,
        borderColor: 'rgba(74, 222, 128, 0.8)',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const costChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Daily Costs ($)',
        data: dailyCosts,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        color: '#fff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#b8d4ff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#b8d4ff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const operations = dashboardData?.report?.operations || {};
  const billing = dashboardData?.report?.billing?.actual || {};

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <div className="dashboard-logo">
            <img src="logo_rounded.png" alt="CapCal AI" className="nav-logo" />
            <span>Firestore Usage Dashboard</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Monitor your Firestore usage and costs.</p>
        </div>

        {dashboardData && (
          <>
            {/* Duration Display */}
            <div className="duration-section">
              <div className="duration-card">
                <h3>Selected Period</h3>
                <div className="duration-info">
                  <div className="date-range">
                    <span className="date-label">From:</span>
                    <span className="date-value">{new Date(dashboardData?.startDate || new Date()).toLocaleDateString()}</span>
                  </div>
                  <div className="date-range">
                    <span className="date-label">To:</span>
                    <span className="date-value">{new Date(dashboardData?.endDate || new Date()).toLocaleDateString()}</span>
                  </div>
                  <div className="duration-summary">
                    <span className="duration-days">
                      {Math.ceil((new Date(dashboardData?.endDate || new Date()) - new Date(dashboardData?.startDate || new Date())) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Usage and Cost Charts */}
            <div className="section-header">
              <h2>Daily Trends</h2>
              <p>Daily usage patterns and cost analysis</p>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Daily Operations</h3>
                <div className="chart-container">
                  <Line data={usageChartData} options={chartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <h3>Daily Costs</h3>
                <div className="chart-container">
                  <Bar data={costChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {dashboardData ? (
          <>
            {/* Operations Overview */}
            <div className="section-header">
              <h2>Operations Overview</h2>
              <p>Current month's database operations</p>
            </div>

            <div className="operations-grid">
              <div className="operation-card reads">
                <div className="operation-header">
                  <div className="operation-icon">📖</div>
                  <h3>Read Operations</h3>
                </div>
                <div className="operation-stats">
                  <div className="stat-number">{formatNumber(operations.read)}</div>
                  <div className="stat-label">Total Reads</div>
                </div>
                <div className="operation-cost">
                  <span>Cost: {formatCurrency(billing?.totalCosts?.readCost)}</span>
                </div>
              </div>

              <div className="operation-card writes">
                <div className="operation-header">
                  <div className="operation-icon">✏️</div>
                  <h3>Write Operations</h3>
                </div>
                <div className="operation-stats">
                  <div className="stat-number">{formatNumber(operations.write)}</div>
                  <div className="stat-label">Total Writes</div>
                </div>
                <div className="operation-cost">
                  <span>Cost: {formatCurrency(billing?.totalCosts?.writeCost)}</span>
                </div>
              </div>

              <div className="operation-card deletes">
                <div className="operation-header">
                  <div className="operation-icon">🗑️</div>
                  <h3>Delete Operations</h3>
                </div>
                <div className="operation-stats">
                  <div className="stat-number">{formatNumber(operations.delete)}</div>
                  <div className="stat-label">Total Deletes</div>
                </div>
                <div className="operation-cost">
                  <span>Cost: {formatCurrency(billing?.totalCosts?.deleteCost)}</span>
                </div>
              </div>

              <div className="operation-card requests">
                <div className="operation-header">
                  <div className="operation-icon">🌐</div>
                  <h3>Total Requests</h3>
                </div>
                <div className="operation-stats">
                  <div className="stat-number">{formatNumber(operations.request)}</div>
                  <div className="stat-label">All Requests</div>
                </div>
                <div className="operation-cost">
                  <span>Total Cost: {formatCurrency(billing?.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="section-header">
              <h2>Cost Breakdown</h2>
              <p>Detailed billing information</p>
            </div>

            <div className="cost-grid">
              <div className="cost-card">
                <h3>Current Period Total</h3>
                <div className="cost-amount">
                  {formatCurrency(billing?.totalCost)}
                </div>
                <div className="cost-breakdown">
                  <div className="breakdown-item">
                    <span>Reads:</span>
                    <span>{formatCurrency(billing?.totalCosts?.readCost)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Writes:</span>
                    <span>{formatCurrency(billing?.totalCosts?.writeCost)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Deletes:</span>
                    <span>{formatCurrency(billing?.totalCosts?.deleteCost)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Functions:</span>
                    <span>{formatCurrency(billing?.totalCosts?.cloudFunctionInvocationCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading-state">
            <div className="loading-card">
              <h3>Loading Usage Data...</h3>
              <p>Fetching your Firestore statistics</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
