// src/Gallery.js
import React from 'react';
import './Gallery.css'; // Create and import a CSS file for styling the gallery

const Gallery = ({ images }) => {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <img src={image} alt={`Gallery item ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
