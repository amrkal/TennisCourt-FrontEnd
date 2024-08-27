import React, { useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '60vh'
};

const center = {
  lat: 33.260420,  // Replace with your location latitude
  lng: 35.770795   // Replace with your location longitude
};

const MapComponent = () => {
  const handleMapClick = useCallback(() => {
    const destination = `${center.lat},${center.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAC8MxvkSpTzAojjdk9FuCMUut9y2dfX5o">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={handleMapClick}
      >
        {/* Add any additional map components here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
