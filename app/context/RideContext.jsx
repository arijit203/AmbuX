import { createContext } from "react";

export const RideContext = createContext({
  ride: [],
  setRide: () => {},
});
