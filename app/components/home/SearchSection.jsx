import React, { useContext, useEffect, useState } from "react";
import InputItem from "./InputItem";
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";
import CarListOptions from "./CarListOptions";
import toast from "react-hot-toast";
import { RideContext } from "../../context/RideContext";

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const { ride, setRide } = useContext(RideContext);

  const [distance, setDistance] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Load ride data from localStorage when the component mounts
  useEffect(() => {
    const savedRide = JSON.parse(localStorage.getItem("ride"));
    if (savedRide) {
      setRide(savedRide);
    }
  }, [setRide]);

  // Save ride data to localStorage whenever it changes
  useEffect(() => {
    if (ride && Object.keys(ride).length) {
      localStorage.setItem("ride", JSON.stringify(ride));
    }
  }, [ride]);

  const calculateDistance = () => {
    if (source && destination && google.maps && google.maps.geometry) {
      const distInMeters =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(source.lat, source.lng),
          new google.maps.LatLng(destination.lat, destination.lng)
        );
      const distInKilometers = distInMeters / 1000; // Convert meters to kilometers
      setDistance(distInKilometers * 0.621371); // Convert kilometers to miles
    }
  };

  useEffect(() => {
    setIsButtonDisabled(
      !(
        source &&
        destination &&
        Object.keys(source).length &&
        Object.keys(destination).length
      )
    );
  }, [source, destination]);

  const handleButtonClick = () => {
    if (isButtonDisabled) {
      toast.error("Fill Pickup and Destination Address");
    } else {
      calculateDistance();
    }
  };

  return (
    <>
      {ride && Object.keys(ride).length ? (
        <>
          <div className="p-5 bg-gray-100 rounded-lg shadow-md">
            <p className="text-2xl font-bold mb-4 text-gray-800">
              Assigned Ambulance Driver
            </p>
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-lg mb-2">
                <strong className="text-gray-700">Driver Name:</strong>{" "}
                {ride.driver_name}
              </p>
              <p className="text-lg mb-2">
                <strong className="text-gray-700">Driver Phone:</strong>{" "}
                {ride.driver_phone}
              </p>
              <p className="text-lg mb-2">
                <strong className="text-gray-700">
                  Ambulance License Plate:
                </strong>{" "}
                {ride.license_plate}
              </p>
              <p className="text-lg">
                <strong className="text-gray-700">Ambulance Requested:</strong>{" "}
                {ride.ambu}
              </p>
            </div>
          </div>
          <div className="mt-6 p-4  border border-gray-300 rounded-lg shadow-sm text-center">
            <p className="text-lg font-semibold text-gray-800">
              Ambulance will be arriving shortly.
            </p>
          </div>
        </>
      ) : (
        <div>
          <div className="p-5 md:pd-6 border-[2px] rounded-xl">
            <p className="text-[20px] font-bold">Book an Ambulance</p>
            <InputItem type="source" />
            <InputItem type="destination" />
            <button
              className={`p-3 w-full mt-5 rounded-lg bg-black text-white`}
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
            >
              Search
            </button>
          </div>

          {distance ? <CarListOptions distance={distance} /> : null}
        </div>
      )}
    </>
  );
}

export default SearchSection;
