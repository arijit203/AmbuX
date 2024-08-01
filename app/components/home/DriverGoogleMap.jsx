// components/home/DriverGoogleMap.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, OverlayViewF ,OverlayView} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('Fetching location...');

  useEffect(() => {
    const handleLocation = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log("New Location: ", newLocation);
      setUserLocation(newLocation);
      fetchLocationName(newLocation);
    };

    const handleError = (error) => {
      console.error("Error getting location", error);
    };

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(handleLocation, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      });

      // Clean up watch position on component unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchLocationName = async (location) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);
      const data = await response.json();
      if (data.status === 'OK' && data.results[0]) {
        setLocationName(data.results[0].formatted_address);
      } else {
        setLocationName('Address not found');
      }
    } catch (error) {
      console.error("Error fetching location name", error);
      setLocationName('Error fetching address');
    }
  };

  const center = userLocation || { lat: -3.745, lng: -38.523 };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} // Replace with your API key
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        options={{ mapId: 'dba0874f794e21c1' }}
      >
        {userLocation && (
          <>
            <Marker position={userLocation} />
            <OverlayViewF
              position={userLocation}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md">
                <p className="text-black text-[14px]">{locationName}</p>
              </div>
            </OverlayViewF>
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
