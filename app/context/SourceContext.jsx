import { createContext } from 'react';

export const SourceContext = createContext({
  source: [],
  setSource: () => {},
});
