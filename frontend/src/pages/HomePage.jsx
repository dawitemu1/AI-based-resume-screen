import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import RoleInfo from '../components/RoleInfo'
import ImageSlider from '../components/ImageSlider'
import './HomePage.css'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <header>
        <h1>Welcome to Recruitment Platform</h1>
        {user && (
          <div className="user-info">
            <p>Hello, {user.name}!</p>
          </div>
        )}
      </header>
      
      <main>
        {user && <RoleInfo />}
        
        {/* AI-Powered Image Slider */}
        <div className="home-slider-section">
          <ImageSlider />
        </div>
        
        {/* Platform Section */}
        <section className="platform-section">
          <h2>Platform</h2>
          <p className="platform-subtitle">Revolutionizing talent acquisition</p>
          
          <div className="platform-features">
            <div className="feature-card">
              <h3>User Management</h3>
              <p>Comprehensive user management system with role-based access control.</p>
            </div>
            
            <div className="feature-card">
              <h3>Job Management</h3>
              <p>Create and manage job postings with detailed requirements.</p>
            </div>
            
            <div className="feature-card">
              <h3>Dashboard Analytics</h3>
              <p>Track user activity and system performance with detailed reports.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage