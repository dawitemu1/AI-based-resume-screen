import React, { useState, useEffect } from 'react';
import aiBrainImage from '../assets/AI_image/ai_brain.svg';
import aiNetworkImage from '../assets/AI_image/ai_network.svg';
import aiDataImage from '../assets/AI_image/ai_data.svg';

const AIImageGallery = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide the AI image gallery after 10 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="ai-image-gallery">
      <h2>AI Image Gallery</h2>
      <div className="ai-images-container">
        <div className="ai-image-item">
          <img src={aiBrainImage} alt="AI Brain" className="ai-animated-image" />
          <p>AI Brain Animation</p>
        </div>
        <div className="ai-image-item">
          <img src={aiNetworkImage} alt="AI Network" className="ai-animated-image" />
          <p>AI Network Animation</p>
        </div>
        <div className="ai-image-item">
          <img src={aiDataImage} alt="AI Data" className="ai-animated-image" />
          <p>AI Data Animation</p>
        </div>
      </div>
    </div>
  );
};

export default AIImageGallery;