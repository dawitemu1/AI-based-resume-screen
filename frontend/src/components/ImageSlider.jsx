import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Import all images from AI_images folder
  const images = [
    '/AI_images/download.jfif',
    '/AI_images/images.jfif',
    '/AI_images/images (1).jfif',
    '/AI_images/images (2).jfif',
    '/AI_images/images (3).jfif',
    '/AI_images/images (4).jfif'
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlay, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="slider-container">
      <div className="slider-header">
        <button 
          className={`autoplay-btn ${isAutoPlay ? 'active' : ''}`}
          onClick={toggleAutoPlay}
        >
          {isAutoPlay ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>

      <div className="slider-wrapper">
        <button className="nav-btn prev-btn" onClick={goToPrevious}>
          ❮
        </button>

        <div className="slider-content">
          <div 
            className="slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="slide">
                <img 
                  src={image} 
                  alt={`AI Recruitment ${index + 1}`}
                  className="slide-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400/4f46e5/ffffff?text=AI+Recruitment+Image';
                  }}
                />
                <div className="slide-overlay">
                  <h3>AI-Powered Recruitment</h3>
                  <p>Revolutionizing talent acquisition with artificial intelligence</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="nav-btn next-btn" onClick={goToNext}>
          ❯
        </button>
      </div>

      {/* Dots indicator */}
      <div className="dots-container">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;