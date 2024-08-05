"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button1";
import Map from "../../components/home/DriverGoogleMap";
import withAuth from "../../../withAuth";
import { jwtDecode } from "jwt-decode"; // Correct import
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RideContext } from "../../context/RideContext";

const prevRides = [
  {
    pickup: "123 Main St, Anytown USA",
    dropoff: "456 Oak Rd, Anytown USA",
    distance: "12 miles",
    fare: "$45.00",
    rating: [true, true, true, true, false],
    condition: "Good",
  },
  {
    pickup: "789 Elm St, Anytown USA",
    dropoff: "321 Pine Rd, Anytown USA",
    distance: "8 miles",
    fare: "$32.00",
    rating: [true, true, true, false, false],
    condition: "Fair",
  },
  // Add more ride objects here
];

function Page() {
  const router = useRouter();
  const [expandedRideIndex, setExpandedRideIndex] = useState(null);
  const [driver, setDriver] = useState(null);
  const [initials, setInitials] = useState("");
  const [notification, setNotification] = useState(null);
  const [hasCheckedAssigned, setHasCheckedAssigned] = useState(false);
  const [notificationSeen, setNotificationSeen] = useState(false); // New state
  const [incompleteRide, setIncompleteRide] = useState(null); // New state
  const [pickupAddress, setPickupAddress] = useState("Fetching address...");
  const [dropoffAddress, setDropoffAddress] = useState("Fetching address...");

  const handleToggleExpand = (index) => {
    setExpandedRideIndex(expandedRideIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const driverId = decodedToken.driverId;

        const response = await axios.get(`/api/driver/get-d/${driverId}`);
        setDriver(response.data);

        const driverNameInitials = response.data.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toUpperCase();
        setInitials(driverNameInitials);
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
      }
    };

    fetchDriverDetails();
  }, []);

  useEffect(() => {
    const checkAssignedStatus = async () => {
      if (!driver || hasCheckedAssigned) return; // Skip if notification has been seen

      try {
        const response = await axios.post("/api/driver/check-assigned", {
          driverId: driver._id,
        });

        if (
          response.data.success &&
          response.data.assigned &&
          !hasCheckedAssigned
        ) {
          setNotification(
            `You have been assigned a new patient with ID: ${response.data.assigned}`
          );
          setHasCheckedAssigned(true);
        }
      } catch (error) {
        console.error("Failed to check assigned status:", error);
      }
    };

    const interval = setInterval(checkAssignedStatus, 5000);

    return () => clearInterval(interval);
  }, [driver, hasCheckedAssigned, notificationSeen]); // Add notificationSeen to dependencies

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const driverId = decodedToken.driverId;

      await axios.post("/api/driver/logout", { driverId });

      localStorage.removeItem("token");
      router.push("/driver");
    } catch (error) {
      console.error("Failed to update offline status:", error);
    }
  };

  const handleNotificationOk = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const driverId = decodedToken.driverId;

      const response = await axios.get(`/api/checkIncompleteRide/${driverId}`);
      console.log("Response ontained: ", response);
      if (response.data.hasIncompleteRide) {
        console.log("Response.data:: ", response.data);
        setIncompleteRide(response.data.ride);
      }

      setNotification(null);
    } catch (error) {
      console.error("Failed to check incomplete ride:", error);
    }
  };

  useEffect(() => {
    const fetchAddress = async (lat, lng, setAddress) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
        );
        const data = await response.json();
        if (data.status === "OK" && data.results[0]) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address", error);
        setAddress("Error fetching address");
      }
    };

    if (incompleteRide) {
      const { source, dest } = incompleteRide;
      if (source) {
        fetchAddress(source.lat, source.lng, setPickupAddress);
      }
      if (dest) {
        fetchAddress(dest.lat, dest.lng, setDropoffAddress);
      }
    }
  }, [incompleteRide]);

  return (
    <>
      <div className="flex flex-col min-h-screen p-5">
        <header className="bg-background px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 border cursor-pointer">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <a
                    className="flex items-center gap-2"
                    onClick={() => router.push("/profile")}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <a className="flex items-center gap-2" onClick={handleLogout}>
                    <LogOutIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <h1 className="text-2xl font-bold">Driver Dashboard</h1>
              {driver ? (
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <p className="text-muted-foreground">{driver.name}</p>
                  <p className="text-muted-foreground">
                    License Plate: {driver.license_plate}
                  </p>
                </div>
              ) : (
                <p>Loading driver details...</p>
              )}
            </div>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-xl font-bold">$250.00</p>
            <p className="text-muted-foreground">Today's Earnings</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_900px] flex-1 gap-4">
          <div className="bg-background p-4 md:p-6 space-y-4">
            {incompleteRide && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Ride</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Pickup</Label>
                        <p className="font-medium">{pickupAddress}</p>
                      </div>
                      <div>
                        <Label>Dropoff</Label>
                        <p className="font-medium">{dropoffAddress}</p>
                      </div>
                      {incompleteRide.patient_name && (
                        <div>
                          <Label>Patient Name</Label>
                          <p className="font-medium">
                            {incompleteRide.patient_name}
                          </p>
                        </div>
                      )}
                      {incompleteRide.patient_ph && (
                        <div>
                          <Label>Patient Phone</Label>
                          <p className="font-medium">
                            {incompleteRide.patient_ph}
                          </p>
                        </div>
                      )}
                      <div>
                        <Label>Condition</Label>
                        <p className="font-medium">
                          {incompleteRide.condition}
                        </p>
                      </div>
                    </div>
                    {/* Additional details for the current ride can go here */}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Previous Rides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prevRides.map((ride, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Pickup</Label>
                        <p className="font-medium">{ride.pickup}</p>
                      </div>
                      <div>
                        <Label>Dropoff</Label>
                        <div className="flex justify-between items-center font-medium">
                          {ride.dropoff}
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto"
                            onClick={() => handleToggleExpand(index)}
                          >
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform ${
                                expandedRideIndex === index ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {expandedRideIndex === index && (
                      <CardContent className="grid p-0 gap-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Distance</Label>
                            <p className="font-medium">{ride.distance}</p>
                          </div>
                          <div>
                            <Label>Fare</Label>
                            <p className="font-medium">{ride.fare}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Condition</Label>
                            <p className="font-medium">{ride.condition}</p>
                          </div>
                          <div>
                            <Label>Rating</Label>
                            <div className="flex items-center">
                              {ride.rating.map((star, idx) => (
                                <StarIcon
                                  key={idx}
                                  className={`h-4 w-4 ${
                                    star ? "text-yellow-400" : "text-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="bg-background p-4 md:p-6">
            <Map incompleteRide={incompleteRide} />
          </div>
        </div>
        {notification && (
          <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-center p-4">
            <p>{notification}</p>
            <Button onClick={handleNotificationOk}>OK</Button>
          </div>
        )}
      </div>
    </>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default withAuth(Page);
