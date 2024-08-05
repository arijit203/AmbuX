import React, { useContext, useState } from "react";
import { CarListData } from "../../../utils/CarListData";
import CarListItem from "./CarListItem";
import { SourceContext } from "../../context/SourceContext";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { DestinationContext } from "../../context/DestinationContext";
import { useRouter } from "next/navigation";
import { RideContext } from "../../context/RideContext";

// import ambulanceGif from "./Ambulancegif.gif"; // Adjust the path as necessary

function CarListOptions({ distance }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showGif, setShowGif] = useState(false);
  const router = useRouter();

  const isButtonDisabled = activeIndex === null;
  const { user } = useUser();
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const { ride, setRide } = useContext(RideContext);

  const handleRequestAmbulance = async () => {
    setShowGif(true);
    try {
      const resp = await fetch(`/api/get-user/${user.id}`);

      if (!resp.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await resp.json();

      const patientId = data._id;

      const response = await axios.post("/api/driver/allocate-drivers", {
        source,
        patientId,
        source,
        destination,
        patientName: data.first_name || null,
        ambu: CarListData[activeIndex].name,
        patient_ph: data.phone_no,
      });
      console.log("response", response);
      if (response.data.success) {
        console.log("Driver allocated successfully:", ride);
        const obj = response.data.obj;
        const driverId = obj.driver_id;
        const resp = await axios.get(`/api/driver/get-d/${driverId}`);
        console.log("resp: ", resp);
        const newRide = {
          driver_name: obj.driver_name,
          ambu_initial_loc: obj.ambu_initial_loc,
          ambu: obj.type_ambu,
          driver_phone: resp.data.phone_no,
          license_plate: resp.data.license_plate,
          source,
          destination,
        };
        setRide(newRide);
        localStorage.setItem("ride", JSON.stringify(newRide));
        console.log("Driver allocated successfully:", ride);
        // Implement the logic to handle driver acceptance here
      } else {
        console.error("Failed to allocate driver:", response.data.error);
      }
    } catch (error) {
      console.error("Error requesting ambulance:", error);
    } finally {
      setShowGif(false);
    }
  };

  return (
    <div className="mt-5 p-5 overflow-auto h-[300px] relative">
      <h2 className="text-[22px] font-bold">Recommended</h2>
      {CarListData.map((item, index) => (
        <div
          key={item.id}
          className={`cursor-pointer rounded-md px-4 border-black ${
            activeIndex === index ? "border-[3px]" : ""
          }`}
          onClick={() => setActiveIndex(index)}
        >
          <CarListItem car={item} distance={distance} />
        </div>
      ))}
      <div
        className={`flex justify-between fixed bottom-5 bg-white p-3 shadow-xl w-full md:w-[30%] border-[1px] items-center ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <h2>Make Payment For</h2>
        <button
          className={`p-3 rounded-lg text-center ${
            isButtonDisabled ? "bg-black text-white" : "bg-black text-white"
          }`}
          disabled={isButtonDisabled}
          onClick={handleRequestAmbulance}
        >
          Request for Ambulance
        </button>
      </div>
      {showGif && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <img
            src="./AmbulanceGif.gif"
            alt="Loading..."
            className="h-100 w-100"
          />
        </div>
      )}
    </div>
  );
}

export default CarListOptions;
