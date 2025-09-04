
import React, { useState } from 'react';
import './PromotersPage.css';

function PromotersPage() {
  const [promoters, setPromoters] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  const handleAddPromoter = () => {
    if (formData.name && formData.email && formData.code) {
      const selectedPlatforms = Object.keys(formData.platforms)
        .filter(platform => formData.platforms[platform])
        .join(', ');
      
      const newPromoter = {
        name: formData.name,
        email: formData.email,
        platforms: selectedPlatforms,
        code: formData.code,
        promoLink: `https://capcalai.com?ref=${formData.code}`,
        install: 0,
        subscribers: 0
      };

      setPromoters(prev => [...prev, newPromoter]);
      setShowModal(false);
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
    }
  };

  return (
    <div className="promoters-page">
      <div className="page-header">
        <h1>Manage Promoters</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>Add New</button>
      </div>
      
      <div className="promoters-table-container">
        <table className="promoters-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Promo Link</th>
              <th>Install</th>
              <th>Subscribers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {promoters.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No promoter added yet.
                </td>
              </tr>
            ) : (
              promoters.map((promoter, index) => (
                <tr key={index}>
                  <td>{promoter.name}</td>
                  <td>{promoter.email}</td>
                  <td className="promo-link">{promoter.promoLink}</td>
                  <td>{promoter.install}</td>
                  <td>{promoter.subscribers}</td>
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
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter promoter name"
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
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

              <div className="form-group code-group">
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

              <button className="add-user-btn" onClick={handleAddPromoter}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromotersPage;
