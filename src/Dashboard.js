
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

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
          const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
          
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

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const operations = dashboardData?.operations || {};
  const billing = dashboardData?.billing?.actual || {};

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
                  <span>Cost: {formatCurrency(billing.reads)}</span>
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
                  <span>Cost: {formatCurrency(billing.writes)}</span>
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
                  <span>Cost: {formatCurrency(billing.deletes)}</span>
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
                  <span>Total Cost: {formatCurrency((billing.reads || 0) + (billing.writes || 0) + (billing.deletes || 0))}</span>
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
                  {formatCurrency((billing.reads || 0) + (billing.writes || 0) + (billing.deletes || 0))}
                </div>
                <div className="cost-breakdown">
                  <div className="breakdown-item">
                    <span>Reads:</span>
                    <span>{formatCurrency(billing.reads)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Writes:</span>
                    <span>{formatCurrency(billing.writes)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Deletes:</span>
                    <span>{formatCurrency(billing.deletes)}</span>
                  </div>
                </div>
              </div>

              <div className="cost-card">
                <h3>Usage Efficiency</h3>
                <div className="efficiency-stats">
                  <div className="efficiency-item">
                    <span>Read/Write Ratio</span>
                    <span>{operations.read && operations.write ? (operations.read / operations.write).toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="efficiency-item">
                    <span>Cost per 1K Reads</span>
                    <span>{operations.read ? formatCurrency((billing.reads || 0) / (operations.read / 1000)) : 'N/A'}</span>
                  </div>
                  <div className="efficiency-item">
                    <span>Cost per 1K Writes</span>
                    <span>{operations.write ? formatCurrency((billing.writes || 0) / (operations.write / 1000)) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Data (Collapsible) */}
            <div className="raw-data-section">
              <details className="raw-data-details">
                <summary>View Raw API Response</summary>
                <div className="api-data">
                  <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
                </div>
              </details>
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
