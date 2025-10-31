import React from 'react';
import ImageSlider from '../components/ImageSlider';
import './Gallery.css';

const Gallery = () => {
  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>AI Recruitment Gallery</h1>
        <p>Explore our AI-powered recruitment platform through these visual insights</p>
      </div>
      
      <ImageSlider />
      
      <div className="gallery-info">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🤖</div>
            <h3>AI-Powered Matching</h3>
            <p>Advanced algorithms analyze resumes and job descriptions to find perfect matches</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Smart Analytics</h3>
            <p>Comprehensive scoring system provides detailed insights into candidate compatibility</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3>Fast Processing</h3>
            <p>Instant resume screening saves time and improves recruitment efficiency</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h3>Precise Results</h3>
            <p>Semantic similarity analysis ensures accurate candidate-job matching</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;