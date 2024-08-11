import React, { useContext, useEffect, useState } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  MarkerF,
  OverlayView,
  OverlayViewF,
} from "@react-google-maps/api";
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";
import axios from "axios";

function GoogleMapSearch() {
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null);
  const [nearestAmbulance, setNearestAmbulance] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [map, setMap] = useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);
  const [routeFromAmbulanceToSource, setRouteFromAmbulanceToSource] =
    useState(null);
  const [ambulanceInitialLocation, setAmbulanceInitialLocation] =
    useState(null);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    // Extract data from localStorage
    const ride = JSON.parse(localStorage.getItem("ride"));
    if (ride) {
      const { source, destination, ambu_initial_loc } = ride;
      if (source) setSource(source);
      if (destination) setDestination(destination);
      if (ambu_initial_loc) setAmbulanceInitialLocation(ambu_initial_loc);
    }

    // Fetch driver data
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("/api/driver/available-drivers");
        if (response.data.success) {
          setDrivers(response.data.drivers);
        } else {
          console.error("Failed to fetch drivers:", response.data.error);
        }
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };

    fetchDrivers();
  }, [setSource, setDestination]);

  useEffect(() => {
    const findNearestAmbulance = async () => {
      try {
        const response = await axios.post("/api/driver/nearest-ambulance", {
          source,
        });
        if (response.data.success) {
          setNearestAmbulance(response.data.minDistance);
          console.log("Nearest ambulance:", response.data.minDistance);
          // Perform actions with the nearest ambulance data
        } else {
          console.error(
            "Failed to find nearest ambulance:",
            response.data.error
          );
        }
      } catch (error) {
        console.error("Error finding nearest ambulance:", error);
      }
    };

    findNearestAmbulance();
  }, [distance, source]);

  useEffect(() => {
    if (source && source.length != 0 && map) {
      map.panTo({ lat: source.lat, lng: source.lng });
      setCenter({ lat: source.lat, lng: source.lng });
    }
  }, [source, map]);

  useEffect(() => {
    if (destination && map) {
      setCenter({ lat: destination.lat, lng: destination.lng });
    }
    if (source && destination) {
      directionRoute();
    } else {
      setDirectionRoutePoints(null);
    }
  }, [destination]);

  useEffect(() => {
    if (ambulanceInitialLocation && source) {
      directionRouteFromAmbulanceToSource();
    }
  }, [ambulanceInitialLocation, source]);

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
            const distanceInMeters = result.routes[0].legs[0].distance.value;
            const distanceInKilometers = distanceInMeters / 1000;
            setDistance(distanceInKilometers);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  const directionRouteFromAmbulanceToSource = () => {
    if (ambulanceInitialLocation && source) {
      const DirectionsService = new google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: {
            lat: ambulanceInitialLocation.lat,
            lng: ambulanceInitialLocation.lng,
          },
          destination: { lat: source.lat, lng: source.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setRouteFromAmbulanceToSource(result);
            const distanceInMeters = result.routes[0].legs[0].distance.value;
            const distanceInKilometers = distanceInMeters / 1000;
            setDistance(distanceInKilometers);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const svgMarkerA = `data:image/svg+xml;charset=UTF-8,
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="white"/>
      <text x="12" y="16" font-size="14" text-anchor="middle" fill="black">A</text>
    </svg>`;

  const svgMarkerB = `data:image/svg+xml;charset=UTF-8,
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="white"/>
      <text x="12" y="16" font-size="14" text-anchor="middle" fill="black">B</text>
    </svg>`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        onLoad={(map) => setMap(map)}
        onUnmount={onUnmount}
        options={{ mapId: "dba0874f794e21c1" }}
      >
        {!directionRoutePoints && source && (
          <MarkerF position={{ lat: source.lat, lng: source.lng }} />
        )}
        {/* {source && <MarkerF position={{ lat: source.lat, lng: source.lng }} />} */}
        {source && source.label && (
          <OverlayViewF
            position={{ lat: source.lat, lng: source.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 bg-white font-bold inline-block">
              <p className="text-black text-[14px]">{source.label}</p>
            </div>
          </OverlayViewF>
        )}

        {!directionRoutePoints && destination && (
          <MarkerF position={{ lat: destination.lat, lng: destination.lng }} />
        )}
        {destination && destination.label && (
          <OverlayViewF
            position={{ lat: destination.lat, lng: destination.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 bg-white font-bold inline-block">
              <p className="text-black text-[14px]">{destination.label}</p>
            </div>
          </OverlayViewF>
        )}

        {directionRoutePoints && (
          <DirectionsRenderer
            directions={directionRoutePoints}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#000", // Black color for the route from source to destination
                strokeWeight: 5,
              },
            }}
          />
        )}

        {routeFromAmbulanceToSource && (
          <DirectionsRenderer
            directions={routeFromAmbulanceToSource}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#00f", // Blue color for the route from ambulance initial location to source
                strokeWeight: 5,
              },
            }}
          />
        )}
        {routeFromAmbulanceToSource ? (
          <MarkerF
            position={{
              lat: ambulanceInitialLocation.lat,
              lng: ambulanceInitialLocation.lng,
            }}
            icon={{
              url: "/Ambulance5.png",
              scaledSize: { width: 35, height: 35 },
            }}
          />
        ) : (
          drivers.map((driver) => (
            <MarkerF
              key={driver._id}
              position={{
                lat: driver.curr_location.lat,
                lng: driver.curr_location.lng,
              }}
              icon={{
                url: "/Ambulance5.png",
                scaledSize: { width: 35, height: 35 },
              }}
            />
          ))
        )}
      </GoogleMap>
      {!ambulanceInitialLocation && nearestAmbulance && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "white",
            border: "1px solid gray",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
            Nearest Ambulance At : {nearestAmbulance.toFixed(2)} Km
          </p>
        </div>
      )}
      {distance && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: ambulanceInitialLocation ? "10px" : "300px",
            backgroundColor: "white",
            border: "1px solid gray",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
            Distance: {distance.toFixed(2)} Km
          </p>
        </div>
      )}
    </div>
  );
}

export default GoogleMapSearch;
