import React from 'react';
import './Modal.css'; // Create and style the modal in CSS

const Modal = ({ show, onClose, onGoogleMaps, onWaze }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Navigation Option</h3>
        <button onClick={onGoogleMaps}>Google Maps</button>
        <button onClick={onWaze}>Waze</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;