"use client";
import React, { useState } from "react";
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

const rides = [
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

  const handleToggleExpand = (index) => {
    setExpandedRideIndex(expandedRideIndex === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const driverId = decodedToken.driverId; // Adjust this according to how your token is structured

      await axios.post("/api/driver/logout", { driverId });

      localStorage.removeItem("token");
      router.push("/driver");
    } catch (error) {
      console.error("Failed to update offline status:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-5">
      <header className="bg-background px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-10 h-10 border cursor-pointer">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>DJ</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a
                  className="flex items-center gap-2"
                  prefetch={false}
                  onClick={() => router.push("/profile")}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a
                  className="flex items-center gap-2"
                  prefetch={false}
                  onClick={handleLogout}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <div className="flex items-center space-x-4">
              <p className="text-muted-foreground">John Doe</p>
              <p className="text-muted-foreground">License Plate: ABC123</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xl font-bold">$250.00</p>
            <p className="text-muted-foreground">Today's Earnings</p>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_900px] flex-1">
        <div className="bg-background p-4 space-y-4 md:p-6 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Previous Rides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rides.map((ride, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pickup</Label>
                      <p className="font-medium">{ride.pickup}</p>
                    </div>
                    <div>
                      <Label>Dropoff</Label>
                      <div className="flex justify-between font-medium">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Distance</Label>
                          <p className="font-medium">{ride.distance}</p>
                        </div>
                        <div>
                          <Label>Fare</Label>
                          <p className="font-medium">{ride.fare}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Condition</Label>
                          <p className="font-medium">{ride.condition}</p>
                        </div>
                        <div>
                          <Label>Rating</Label>
                          <div className="flex items-center gap-1">
                            {ride.rating.map((star, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  star
                                    ? "fill-primary"
                                    : "text-muted-foreground"
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
          <div className="flex justify-end">
            <Button>Start New Ride</Button>
          </div>
        </div>
        <div className="bg-muted pr-5">
          <Map />
        </div>
      </div>
    </div>
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
      <path d="m6 9 6 6 6-6" />
    </svg>
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
