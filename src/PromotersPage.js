
import React, { useState } from 'react';
import './PromotersPage.css';

function PromotersPage() {
  const [promoters, setPromoters] = useState([]);

  return (
    <div className="promoters-page">
      <div className="page-header">
        <h1>Manage Promoters</h1>
        <button className="add-btn">Add New</button>
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
                  <td>{promoter.promoLink}</td>
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
    </div>
  );
}

export default PromotersPage;
