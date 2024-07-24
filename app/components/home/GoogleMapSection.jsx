"use client";

import React, { useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";


function GoogleMapSearch() {
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);

  const containerStyle = {
    width: '100%',
    height: window.innerWidth * 0.45,
  };

  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  const [map, setMap] = useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);

  useEffect(() => {
    if (source && map) {
      map.panTo({
        lat: source.lat,
        lng: source.lng,
      });
      setCenter({
        lat: source.lat,
        lng: source.lng,
      });
    }
    if (source && destination) {
      directionRoute();
    } else {
      setDirectionRoutePoints(null);
    }
  }, [source]);

  useEffect(() => {
    if (destination && map) {
      setCenter({
        lat: destination.lat,
        lng: destination.lng,
      });
    }
    if (source && destination) {
      directionRoute();
    } else {
      setDirectionRoutePoints(null);
    }
  }, [destination]);

  const directionRoute = () => {
    if (source && destination) {
      const DirectionsService = new google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: { lat: source.lat, lng: source.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionRoutePoints(result);
          } else {
           
            console.error('Error');
          }
        }
      );
    }
  };

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
      onLoad={(map) => setMap(map)}
      onUnmount={onUnmount}
      options={{ mapId: 'dba0874f794e21c1' }}
    >
      {source ? (
        <>
          <MarkerF position={{ lat: source.lat, lng: source.lng }} />
          {source.label && (
            <OverlayViewF position={{ lat: source.lat, lng: source.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <div className="p-2 bg-white font-bold inline-block">
                <p className="text-black text-[14px]">{source.label}</p>
              </div>
            </OverlayViewF>
          )}
        </>
      ) : null}

      {destination ? (
        <>
          <MarkerF position={{ lat: destination.lat, lng: destination.lng }} />
          {destination.label && (
            <OverlayViewF position={{ lat: destination.lat, lng: destination.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <div className="p-2 bg-white font-bold inline-block">
                <p className="text-black text-[14px]">{destination.label}</p>
              </div>
            </OverlayViewF>
          )}
        </>
      ) : null}

      {directionRoutePoints && (
        <DirectionsRenderer
          directions={directionRoutePoints}
          options={{
            polylineOptions: {
              strokeColor: '#000',
              strokeWeight: 5,
            },
          }}
        />
      )}
    </GoogleMap>
  );
}

export default GoogleMapSearch;
