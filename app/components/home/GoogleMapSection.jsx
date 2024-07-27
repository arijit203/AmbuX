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

  const svgMarker = `data:image/svg+xml;charset=UTF-8,
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14 10h-4v4h4v-4ZM7 7v10h10V7H7Z" fill="black"/>
    </svg>`;
    const svgMarker1 = `data:image/svg+xml;charset=UTF-8,
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-2a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="black"/>
    </svg>`;

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
          <MarkerF position={{ lat: source.lat, lng: source.lng }}  
          // icon={{
          //   url:svgMarker1,
          //   scaledSize:{
          //     width:35,
          //     height:35
          //   }
          // }}
          />
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
          <MarkerF position={{ lat: destination.lat, lng: destination.lng }} 
          // icon={{
          //   url:svgMarker,
          //   scaledSize:{
          //     width:35,
          //     height:35
          //   }
          // }}
          />
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
