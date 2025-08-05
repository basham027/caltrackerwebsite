
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
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Initialize date range with current month
  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1, 0, 0, 0, 0
    ));
    const endDate = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + 1,
      -1, 23, 59, 59, 999
    ));
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (customStartDate = null, customEndDate = null) => {
      try {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (isAuthenticated === 'true') {
          setUser({
            name: localStorage.getItem('userName') || 'User',
            email: localStorage.getItem('userEmail') || 'user@example.com'
          });

          // Use custom dates or fall back to current month
          let startDate, endDate;
          
          if (customStartDate && customEndDate) {
            startDate = new Date(customStartDate + 'T00:00:00.000Z');
            endDate = new Date(customEndDate + 'T23:59:59.999Z');
          } else {
            const currentDate = new Date();
            startDate = new Date(Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              1, 0, 0, 0, 0
            ));
            endDate = new Date(Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth() + 1,
              -1, 23, 59, 59, 999
            ));
          }
          
          
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
  
  useEffect(() => {
   /* if (dateRange.startDate && dateRange.endDate) {
      fetchDashboardData(dateRange.startDate, dateRange.endDate);
    }*/
  }, [dateRange]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateRange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      setLoading(true);
      fetchDashboardData(dateRange.startDate, dateRange.endDate);
    }
  };

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

  // Generate daily data based on selected date range
  const generateDailyData = () => {
    if (!dashboardData?.report?.timeRange) {
      return { dailyLabels: [], dailyOperations: [], dailyCosts: [], dailyReads: [], dailyWrites: [], dailyDeletes: [] };
    }
    
    const startDate = new Date(dashboardData.report.timeRange.startTime);
    const endDate = new Date(dashboardData.report.timeRange.endTime);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const dailyLabels = [];
    const dailyOperations = [];
    const dailyCosts = [];
    const firestoreCosts = [];
    const openaiCosts = [];
    const dailyReads = [];
    const dailyWrites = [];
    const dailyDeletes = [];
    
    const operationsData = dashboardData?.report?.dailyUsage || [];
    console.log('operationsData', operationsData)
    const billing = dashboardData?.report?.billing?.actual || {};
    
    for (let i = 0; i < operationsData.length; i++) {
      const currentDate = new Date(operationsData[i].date);
     // currentDate.setDate(startDate.getDate() + i);
      
      // Format label as MM/DD
      const label = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
      dailyLabels.push(label);
      
      const operations = operationsData[i].operations;
      
      // Distribute operations across days with realistic variance
      const variance = 0.7 + Math.random() * 0.6; // 70% to 130% of average
      const dailyTotal = (operations.request || 0).toFixed(2);
      const dailyRead = (operations.read || 0).toFixed(2);
      const dailyWrite = (operations.write || 0).toFixed(2);
      const dailyDelete = (operations.delete || 0).toFixed(2);
      const dailyCost =   (operationsData[i].costs.totalDayCost || 0).toFixed(2);
      const firestoreCost =   (operationsData[i].costs.totalFirestoreCost || 0).toFixed(2);
      const openaiCost =   (operationsData[i].costs.openaiCost || 0).toFixed(2);
      
      console.log('operations', operations)
      
      dailyOperations.push(dailyTotal);
      dailyReads.push(dailyRead);
      dailyWrites.push(dailyWrite);
      dailyDeletes.push(dailyDelete);
      dailyCosts.push(dailyCost);
      openaiCosts.push(openaiCost);
      firestoreCosts.push(firestoreCost)
    }
    
    return { dailyLabels, dailyOperations, dailyCosts, dailyReads, dailyWrites, dailyDeletes, openaiCosts, firestoreCosts };
  };

  const { dailyLabels, dailyOperations, dailyCosts, dailyReads, dailyWrites, dailyDeletes, openaiCosts, firestoreCosts } = dashboardData ? generateDailyData() : {
    dailyLabels: [], dailyOperations: [], dailyCosts: [], dailyReads: [], dailyWrites: [], dailyDeletes: [], openaiCosts: [], firestoreCosts: []
  };

  const usageChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Read Operations',
        data: dailyReads,
        borderColor: 'rgba(74, 222, 128, 0.9)',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Write Operations',
        data: dailyWrites,
        borderColor: 'rgba(245, 158, 11, 0.9)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Delete Operations',
        data: dailyDeletes,
        borderColor: 'rgba(239, 68, 68, 0.9)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };
  
  const firestoreChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Firestore Costs ($)',
        data: firestoreCosts,
        borderColor: 'rgba(74, 222, 128, 0.9)',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };
  
  const openaiChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Daily Costs ($)',
        data: openaiCosts,
        borderColor: 'rgba(245, 158, 11, 0.9)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const usageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#b8d4ff',
          callback: function(value) {
            return formatNumber(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#b8d4ff',
          maxTicksLimit: 10,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const costChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#b8d4ff',
          callback: function(value) {
            return formatCurrency(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#b8d4ff',
          maxTicksLimit: 10,
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
          <div className="date-range-selector">
            <div className="date-inputs">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="date-input"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="date-input"
              />
              <button onClick={applyDateRange} className="apply-date-btn">
                Apply
              </button>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Monitor your Usage and Costs.</p>
        </div>

        {dashboardData && (
          <>
            {/* Duration Display */}
            <div className="duration-section">
              <div className="total-cost-display">
                <div className="total-cost-card">
                  <h2>Total Cost This Period</h2>
                  <div className="total-cost-amount">
                    {formatCurrency(billing?.totalCost)}
                  </div>
                  {/*<p>Total usage cost</p>*/}
                </div>
              </div>
              <div className="duration-card">
                <h3>Selected Period</h3>
                <div className="duration-info">
                  <div className="date-range">
                    <span className="date-label">From:</span>
                    <span className="date-value">{new Date(dashboardData?.report?.timeRange?.startTime || new Date()).toLocaleDateString()}</span>
                  </div>
                  <div className="date-range">
                    <span className="date-label">To:</span>
                    <span className="date-value">{new Date(dashboardData?.report?.timeRange?.endTime || new Date()).toLocaleDateString()}</span>
                  </div>
                  <div className="duration-summary">
                    <span className="duration-days">
                      {Math.ceil((new Date(dashboardData?.report?.timeRange?.endTime || new Date()) - new Date(dashboardData?.report?.timeRange?.startTime || new Date())) / (1000 * 60 * 60 * 24))} days
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
                <h3>Daily Operations Breakdown</h3>
                <div className="chart-subtitle">
                  Read, Write, and Delete operations over time
                </div>
                <div className="chart-container">
                  <Line data={usageChartData} options={usageChartOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <h3>Daily Firestore Cost Analysis</h3>
                <div className="chart-subtitle">
                  Daily spending on Firestore Read, Write, Delete operations
                </div>
                <div className="chart-container">
                  <Bar data={firestoreChartData} options={costChartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <h3>Daily Cost Analysis</h3>
                <div className="chart-subtitle">
                  Daily total spending
                </div>
                <div className="chart-container">
                  <Bar data={costChartData} options={costChartOptions} />
                </div>
              </div>
              <div className="chart-card">
                <h3>Daily OpenAi Cost Analysis</h3>
                <div className="chart-subtitle">
                  Daily spending on OpenAi operations
                </div>
                <div className="chart-container">
                  <Bar data={openaiChartData} options={costChartOptions} />
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
                  <div className="breakdown-item">
                    <span>OpenAI:</span>
                    <span>{formatCurrency(billing?.totalCosts?.openaiCost)}</span>
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
