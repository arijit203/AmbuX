// components/AuthorizedHome.js
"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import Header from "../components/Header";
import SearchSection from "../components/home/SearchSection";
import GoogleMapSection from "../components/home/GoogleMapSection";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import PhoneNumberPopup from "../components/PhoneNumberPopup";
import { RideContext } from "../context/RideContext";

export default function Home() {
  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const { isSignedIn, isLoaded } = useAuth();
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [distance, setDistance] = useState(null);
  const [ride, setRide] = useState([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/get-user/${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        // console.log("data",data)

        if (!data.phone_no) {
          setShowPhonePopup(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isLoaded && user && !user.phone_no) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, router, user]);

  const handlePhoneSubmit = async (phoneNo) => {
    try {
      await updatePhoneNumberInDB(user.id, phoneNo);
      setShowPhonePopup(false);
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      {showPhonePopup && <PhoneNumberPopup onSubmit={handlePhoneSubmit} />}
      <Header />
      <SourceContext.Provider value={{ source, setSource }}>
        <DestinationContext.Provider value={{ destination, setDestination }}>
          <RideContext.Provider value={{ ride, setRide }}>
            <LoadScript
              libraries={["places"]}
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
          </RideContext.Provider>
        </DestinationContext.Provider>
      </SourceContext.Provider>
    </>
  );
}

// Function to make an API call to update the phone number in the database
async function updatePhoneNumberInDB(userId, phoneNo) {
  const response = await fetch("/api/update-phone-number", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, phoneNo }),
  });

  if (!response.ok) {
    throw new Error("Failed to update phone number");
  }

  const data = await response.json();
  return data;
}
