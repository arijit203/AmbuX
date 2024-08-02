import React, { useState } from "react";
import { CarListData } from "../../../utils/CarListData";
import CarListItem from "./CarListItem";

function CarListOptions({ distance }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const isButtonDisabled = activeIndex === null;

  return (
    <div className="mt-5 p-5 overflow-auto h-[300px]">
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
        >
          Request for Ambulance
        </button>
      </div>
    </div>
  );
}

export default CarListOptions;
