import { createContext } from 'react';

export const DestinationContext = createContext({
  destination: [],
  setDestination: () => {},
});
