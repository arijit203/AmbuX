"use client";

import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';

// Dynamically load GooglePlacesAutocomplete with no SSR
const GooglePlacesAutocomplete = dynamic(() => import('react-google-places-autocomplete'), { ssr: false });

import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";

function InputItem({ type = 'source' }) {
  const [value, setValue] = useState(null);
  const [placeholder, setPlaceholder] = useState('');

  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);

  useEffect(() => {
    setPlaceholder(type === 'source' ? 'Pickup Location' : 'Dropoff Location');
  }, [type]);

  const getLatAndLng = (place, type) => {
    if (!place) {
      if (type === 'source') {
        setSource(null);
      } else {
        setDestination(null);
      }
      return;
    }

    const placeId = place.value.place_id;
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({ placeId }, (place, status) => {
      if (status === 'OK' && place.geometry && place.geometry.location) {
        if (type === 'source') {
          setSource({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.formatted_address,
            label: place.name,
          });
        } else {
          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.formatted_address,
            label: place.name,
          });
        }
      }
    });
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(latitude, longitude);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = {
            value: {
              place_id: 'current-location',
            },
            label: results[0].formatted_address,
          };
          setValue(location);
          setSource({
            lat: latitude,
            lng: longitude,
            name: results[0].formatted_address,
            label: results[0].formatted_address,
          });
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    }, (error) => {
      console.error(error);
    });
  };

  return (
    <div className="bg-slate-200 p-3 rounded-lg mt-3 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {type === 'source' ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            data-baseweb="icon"
          >
            <title>Search</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-2a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            data-baseweb="icon"
          >
            <title>Search</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14 10h-4v4h4v-4ZM7 7v10h10V7H7Z"
              fill="currentColor"
            />
          </svg>
        )}
        <div className="flex-1">
          <GooglePlacesAutocomplete
            selectProps={{
              value,
              onChange: (place) => {
                setValue(place);
                if (place) {
                  getLatAndLng(place, type);
                } else {
                  if (type === 'source') {
                    setSource(null);
                  } else {
                    setDestination(null);
                  }
                }
              },
              placeholder: placeholder,
              isClearable: true,
              className: 'w-full',
              components: {
                DropdownIndicator: false,
              },
              styles: {
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#00ffff00',
                  border: 'none',
                }),
              },
            }}
          />
        </div>
        {type === 'source' && (
  <div className="relative">
    <button
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-muted-foreground group"
      onClick={handleGetCurrentLocation}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span className="sr-only">Get current location</span>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
        Get Current Location
      </div>
    </button>
  </div>
)}

      </div>
    </div>
  );
}

export default InputItem;
