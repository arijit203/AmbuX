import React, { useContext, useEffect, useState } from 'react';
import InputItem from "./InputItem";
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";
import CarListOptions from "./CarListOptions";
import toast, { Toaster } from 'react-hot-toast';


function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);

  const [distance, setDistance] = useState();

  const calculateDistance = () => {
    if (source && destination) {
      const distInMeters = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(source.lat, source.lng),
        new google.maps.LatLng(destination.lat, destination.lng)
      );
      const distInKilometers = distInMeters / 1000; // Convert meters to kilometers
      setDistance(distInKilometers * 1.60934); // Convert kilometers to miles
    }
  };
  let isButtonDisabled ;
  useEffect(()=>{
    
    isButtonDisabled = !(source && destination && Object.keys(source).length && Object.keys(destination).length);
  },[source,destination])
  
  const handleButtonClick = () => {
    
    if (isButtonDisabled) {
      toast.error("Fill Pickup and Destination Address");
    } else {
      calculateDistance();
    }
  };
  

  return (
    <div>
      <div className='p-5 md:pd-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Book an Ambulance</p>
        <InputItem type='source' />
        <InputItem type='destination' />
        <button
          className={`p-3 w-full mt-5 rounded-lg  bg-black text-white`}
          onClick={handleButtonClick}
          
        >
          Search
        </button>
      </div>
      {distance ? <CarListOptions distance={distance} /> : null}
     
    </div>
  );
}

export default SearchSection;
