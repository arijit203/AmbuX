// /contexts/RoleContext.js
'use client'

import { createContext, useState, useContext } from 'react';

// Create a Context for the role
const RoleContext = createContext();

// Provider component that wraps your app and makes the role object available to any child component
export const RoleProvider = ({ children }) => {
  // State to hold the current role
  const [role, setRole] = useState(null);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use the RoleContext and access the role and setRole functions
export const useRole = () => useContext(RoleContext);
