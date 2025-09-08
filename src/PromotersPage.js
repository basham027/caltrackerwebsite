
import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import './PromotersPage.css';

function PromotersPage() {
  const [promoters, setPromoters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platforms: {
      tiktok: false,
      facebook: false,
      instagram: false,
      youtube: false,
      linkedin: false,
      x: false,
      threads: false,
      pinterest: false,
      others: false
    },
    code: ''
  });

  // Fetch promoters from API
  const fetchPromoters = async (page = 1, search = '', status = 'active') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        status: status,
        ...(search && { search: search })
      });
      
      const response = await fetch(`https://getpromotorslist-zbhi5gq6gq-uc.a.run.app?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPromoters(data.promotors || []);
          setPagination(data.pagination);
        } else {
          console.error('Failed to fetch promoters:', data.message);
        }
      } else {
        console.error('Failed to fetch promoters:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching promoters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load promoters on component mount
  useEffect(() => {
    fetchPromoters(1, searchTerm, statusFilter);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchPromoters(1, value, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    fetchPromoters(1, searchTerm, status);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchPromoters(page, searchTerm, statusFilter);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlatformChange = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };

  const generateCode = () => {
    const code = 'PROMO'+Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  const handleAddPromoter = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('Please enter an email');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!formData.code.trim()) {
      alert('Please generate a code');
      return;
    }
    
    // Check if at least one platform is selected
    const hasSelectedPlatform = Object.values(formData.platforms).some(platform => platform);
    if (!hasSelectedPlatform) {
      alert('Please select at least one platform');
      return;
    }

    try {
      setSaving(true);
      const selectedPlatforms = Object.keys(formData.platforms)
        .filter(platform => formData.platforms[platform]);
      
      const promoterData = {
        name: formData.name,
        email: formData.email,
        platforms: selectedPlatforms,
        code: formData.code,
        promoLink: `https://capcalai.com/com.mafooly.caloriai/invite/${formData.code}`
      };

      // Call API to save promoter
      const response = await fetch('https://savepromotor-zbhi5gq6gq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promoterData)
      });

      if (response.ok) {
        // Add to local state for display
        const newPromoter = {
          ...promoterData,
          platforms: selectedPlatforms.join(', '),
          install: 0,
          subscribers: 0
        };

        // Refresh promoters list
        fetchPromoters(pagination.currentPage, searchTerm, statusFilter);
        setShowModal(false);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          platforms: {
            tiktok: false,
            facebook: false,
            instagram: false,
            youtube: false,
            linkedin: false,
            x: false,
            threads: false,
            pinterest: false,
            others: false
          },
          code: ''
        });
        
        alert('Promoter added successfully!');
      } else {
        const errorData = await response.text();
        alert(`Error saving promoter: ${errorData}`);
      }
    } catch (error) {
      console.error('Error saving promoter:', error);
      alert('Error saving promoter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  return (
    <div className="promoters-page">
      <div className="page-header">
        <h1>Manage Promoters</h1>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search promoters..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="status-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="">All Status</option>
            </select>
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>Add New</button>
        </div>
      </div>
      
      <div className="promoters-table-container">
        <table className="promoters-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Promo Link</th>
              <th>Clicks</th>
              <th>Install</th>
              <th>Subscribers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="no-data">
                  Loading promoters...
                </td>
              </tr>
            ) : promoters.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No promoters found.
                </td>
              </tr>
            ) : (
              promoters.map((promoter, index) => (
                <tr key={promoter.id || index}>
                  <td>{promoter.name}</td>
                  <td>{promoter.email}</td>
                  <td className="promo-link-cell">
                    <div className="promo-link-container">
                      <a
                        href={promoter.promoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="promo-link"
                        title={promoter.promoLink}
                      >
                        {promoter.promoLink}
                      </a>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(promoter.promoLink)}
                        title="Copy link"
                      >
                        {copiedLink === promoter.promoLink ? '✓' : '📋'}
                      </button>
                    </div>
                  </td>
                  <td>{promoter.promoClicks || 0}</td>
                  <td>{promoter.installs || 0}</td>
                  <td>{promoter.subscribers || 0}</td>
                  <td>
                    <button className="action-btn">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && promoters.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} promoters
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </button>
            <span className="page-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Promoter Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <button className="back-btn" onClick={() => setShowModal(false)}>
                ← Add New
              </button>
            </div>
            
            <div className="modal-content">
              <div className="promotor-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter promoter name"
                />
              </div>

              <div className="promotor-form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="promotor-form-group">
                <label>Platform:</label>
                <div className="platform-checkboxes">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.tiktok}
                      onChange={() => handlePlatformChange('tiktok')}
                    />
                    TikTok
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.facebook}
                      onChange={() => handlePlatformChange('facebook')}
                    />
                    Facebook
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.instagram}
                      onChange={() => handlePlatformChange('instagram')}
                    />
                    Instagram
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.youtube}
                      onChange={() => handlePlatformChange('youtube')}
                    />
                    Youtube
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.linkedin}
                      onChange={() => handlePlatformChange('linkedin')}
                    />
                    LinkedIn
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.x}
                      onChange={() => handlePlatformChange('x')}
                    />
                    X
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.threads}
                      onChange={() => handlePlatformChange('threads')}
                    />
                    Threads
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.pinterest}
                      onChange={() => handlePlatformChange('pinterest')}
                    />
                    Pinterest
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.platforms.others}
                      onChange={() => handlePlatformChange('others')}
                    />
                    Others
                  </label>
                </div>
              </div>

              <div className="promotor-form-group code-group">
                <label>Code:</label>
                <div className="code-input-container">
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Generated code"
                    readOnly
                  />
                  <button className="generate-btn" onClick={generateCode}>
                    Generate
                  </button>
                </div>
              </div>

              <button className="add-user-btn" onClick={handleAddPromoter} disabled={saving}>
                {saving ? (
                  <div className="loading-container">
                    <ClipLoader color="#ffffff" size={20} />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Add User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromotersPage;
