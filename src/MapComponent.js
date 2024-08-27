import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Modal from './Modal';

const containerStyle = {
  width: '100%',
  height: '60vh'
};

const center = {
  lat: 33.259654,  // Replace with your location's latitude
  lng: 35.769403   // Replace with your location's longitude
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy'
};

const MapComponent = () => {
  const [showModal, setShowModal] = useState(false);

  const handleMarkerClick = () => {
    setShowModal(true);
  };

  const handleGoogleMaps = () => {
    const destination = `${center.lat},${center.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(googleMapsUrl, '_blank');
    setShowModal(false);
  };

  const handleWaze = () => {
    const destination = `${center.lat},${center.lng}`;
    const wazeUrl = `https://waze.com/ul?ll=${center.lat},${center.lng}&navigate=yes`;
    window.open(wazeUrl, '_blank');
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyAC8MxvkSpTzAojjdk9FuCMUut9y2dfX5o">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={18}
          options={options}
          onClick={handleMarkerClick}
        >
          <Marker
            position={center}
            onClick={handleMarkerClick}
          />
        </GoogleMap>
      </LoadScript>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onGoogleMaps={handleGoogleMaps}
        onWaze={handleWaze}
      />
    </>
  );
};

export default MapComponent;
