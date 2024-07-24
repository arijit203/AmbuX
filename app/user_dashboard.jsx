// pages/user_dashboard.jsx
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from 'react';
import Header from "../components/Header";
import SearchSection from "../components/home/SearchSection";
import GoogleMapSection from "../components/home/GoogleMapSection";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import { useState } from 'react';
import { LoadScript } from "@react-google-maps/api";

export default function UserDashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in'); // Redirect to sign-in if not authenticated
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Show loading while checking auth status
  }

  if (!isSignedIn) {
    return null; // Prevent rendering protected content if not signed in
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
