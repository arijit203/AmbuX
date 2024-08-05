import React, { useState, useEffect, useContext, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  OverlayViewF,
  OverlayView,
} from "@react-google-maps/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { RideContext } from "../../context/RideContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const fetchAddress = async (lat, lng, setAddress) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results[0]) {
      setAddress(data.results[0].formatted_address);
    } else {
      setAddress("Address not found");
    }
  } catch (error) {
    console.error("Error fetching address", error);
    setAddress("Error fetching address");
  }
};

const Map = ({ incompleteRide }) => {
  const [userLocation, setUserLocation] = useState({});
  const [locationName, setLocationName] = useState("Fetching location...");
  const [firstTime, setFirstTime] = useState(1);
  const [sourceName, setSourceName] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [ambuInitialLoc, setAmbuInitialLoc] = useState(null);
  const [source, setSource] = useState(null);
  const { rides, setRides } = useContext(RideContext);
  const mapRef = useRef(null);

  useEffect(() => {
    if (incompleteRide) {
      const { ambu_initial_loc, source } = incompleteRide;
      setAmbuInitialLoc(ambu_initial_loc);
      setSource(source);
      fetchDirections(ambu_initial_loc, source);
    }
  }, [incompleteRide]);

  useEffect(() => {
    if (source) {
      fetchLocationName(source, setSourceName);
    }
  }, [source]);

  useEffect(() => {
    const handleLocation = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log("New Location: ", newLocation);
      setUserLocation(newLocation);
      fetchLocationName(newLocation, setLocationName);
    };

    const handleError = (error) => {
      console.error("Error getting location", error);
    };

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        handleLocation,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const updateDriverLocation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const driverId = decodedToken.driverId; // Adjust this according to how your token is structured

      await axios.post("/api/driver/updateLocation", {
        driverId,
        location: userLocation,
      });
    } catch (error) {
      console.error("Failed to update driver location:", error);
    }
  };

  const isObjectNotEmpty = (obj) => {
    return obj && Object.keys(obj).length > 0;
  };

  useEffect(() => {
    if (isObjectNotEmpty(userLocation) && firstTime) {
      updateDriverLocation();
      setFirstTime(0);
    }

    const intervalId = setInterval(() => {
      if (isObjectNotEmpty(userLocation)) {
        updateDriverLocation();
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userLocation]);

  const fetchLocationName = async (location, func) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results[0]) {
        func(data.results[0].formatted_address);
      } else {
        func("Address not found");
      }
    } catch (error) {
      console.error("Error fetching location name", error);
      func("Error fetching address");
    }
  };

  const fetchDirections = async (start, end) => {
    if (start && end) {
      const DirectionsService = new google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: { lat: start.lat, lng: start.lng },
          destination: { lat: end.lat, lng: end.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
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
        options={{ mapId: "dba0874f794e21c1" }}
        onLoad={(map) => (mapRef.current = map)}
      >
        {/* {userLocation && (
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
        )} */}

        {ambuInitialLoc ? (
          <>
            <Marker
              position={ambuInitialLoc}
              icon={{
                url: "/Ambulance5.png",
                scaledSize: { width: 35, height: 35 },
              }}
            />
            <OverlayViewF
              position={ambuInitialLoc}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md">
                <p className="text-black text-[14px]">
                  Your Ambulance Location
                </p>
              </div>
            </OverlayViewF>
          </>
        ) : (
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

        {source && (
          <>
            <Marker position={source} />
            <OverlayViewF
              position={source}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md">
                <p className="text-black text-[14px]">{sourceName}</p>
              </div>
            </OverlayViewF>
          </>
        )}

        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#000", // Black color for the route
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
