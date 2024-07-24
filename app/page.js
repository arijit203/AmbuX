'use client';

import { UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchSection from "./components/home/SearchSection";
import GoogleMapSection from "./components/home/GoogleMapSection";
import { SourceContext } from "./context/SourceContext";
import { DestinationContext } from "./context/DestinationContext";
import { useState, useEffect } from 'react';
import { LoadScript } from "@react-google-maps/api";
import Header from "./components/Header";

export default function Home() {
  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Avoid rendering the page until the auth state is known
  if (!isLoaded) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (!isSignedIn) {
    return null; // Prevent rendering if the user is not signed in
  }

  return (
    <>
      <Header />
      <SourceContext.Provider value={{ source, setSource }}>
        <DestinationContext.Provider value={{ destination, setDestination }}>
          <LoadScript 
            libraries={['places']}
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <SearchSection />
              </div>
              <div className="col-span-2">
                <GoogleMapSection />
              </div>
            </div>
          </LoadScript>
        </DestinationContext.Provider>
      </SourceContext.Provider>
    </>
  );
}
