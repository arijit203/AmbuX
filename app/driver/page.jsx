"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import OtpPopup from "../components/OtpPopup";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    license_plate: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    console.log("Found token");
    // If token is not present, redirect to login page
    if (token) {
      console.log("Redirecting");
      router.push("/driver/dashboard");
    }
  }, [router]);

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('/api/driver/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(form),
  //     });

  //     if (response.ok) {
  //       // Redirect to driver dashboard on successful registration
  //       toast.success("Registration Successful!")
  //       router.push('/driver/dashboard');
  //     } else {
  //       const errorData = await response.json();
  //       alert(errorData.error);
  //     }
  //   } catch (error) {
  //       toast.error("Error Registering!")
  //     console.error('Error registering:', error);
  //   }
  // };

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [phoneForOtp, setPhoneForOtp] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Replace with your API endpoint
      let ph = "+91" + form.phone;
      const response = await fetch("/api/driver/get-driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_no: ph }),
      });

      // console.log("response: ", response.json());
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.exists) {
        // Phone number already exists
        toast.error(
          "Phone number already exists. Please login  or use a different number."
        );
      } else {
        // Phone number does not exist, show OTP popup
        setPhoneForOtp(ph);
        setShowOtpPopup(true);
      }
    } catch (error) {
      console.error("Error checking phone existence:", error);
      alert(
        "An error occurred while checking the phone number. Please try again."
      );
    }
  };

  const handleOtpVerification = async (fullPhoneNumber) => {
    try {
      // Send the registration data to the server after OTP is verified
      const obj = {
        ...form,
        phone: fullPhoneNumber, // Include the phone number in the request
      };

      const response = await fetch("/api/driver/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token (or any other authentication data) if needed
        localStorage.setItem("token", data.token);

        toast.success("Registration successful!");
        router.push("/driver/dashboard");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Registration failed.");
      }
    } catch (error) {
      toast.error("Error registering.");
      console.error("Error registering:", error);
    } finally {
      setShowOtpPopup(false); // Close OTP popup after registration attempt
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login handler");
    try {
      const response = await fetch("/api/driver/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      console.log("response in longin handler: ", response);

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token (or any other authentication data) if needed
        localStorage.setItem("token", data.token);
        // Redirect to driver dashboard on successful login
        toast.success("Login Successful!");
        router.push("/driver/dashboard");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      toast.error("Error Registering!");
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[100dvh] w-full">
      <div className="flex flex-col items-center justify-center bg-primary p-6 md:p-10">
        <div className="max-w-md space-y-4">
          <Link
            href="/"
            className="absolute top-4 left-4 inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary-foreground">
            Welcome Ambulance Driver
          </h1>
          <p className="text-primary-foreground/80">
            Register or login to access our services and manage your account.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid gap-2 mt-6">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div> */}

                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex">
                    <button
                      id="dropdown-phone-button"
                      data-dropdown-toggle="dropdown-phone"
                      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-black bg-gray-100 border  rounded-l-lg hover:bg-gray-200  focus:ring-4 focus:outline-none focus:border-black dark:text-black"
                      type="button"
                    >
                      +91
                      <svg
                        className="w-2.5 h-2.5 ms-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    <input
                      type="tel"
                      id="phone"
                      className="block p-2.5 w-full text-sm text-black bg-white border border-gray-300 rounded-r-lg dark:focus:border-blue-500"
                      pattern="\d{10}"
                      placeholder="1234567890"
                      onChange={handleInputChange}
                      required
                    />
                    <div
                      id="dropdown-phone"
                      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-52 "
                    >
                      <ul
                        className="py-2 text-sm text-black-700 "
                        aria-labelledby="dropdown-phone-button"
                      >
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-black-700  dark:text-gray-200  dark:hover:text-white"
                            role="menuitem"
                          ></button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license_plate">
                    Driver License Plate <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="license_plate"
                    placeholder="Enter your driver license plate"
                    value={form.license_plate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your home address"
                    value={form.address}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>
              {showOtpPopup && (
                <OtpPopup
                  onSubmit={handleOtpVerification} // Pass the handler to OTP component
                  phoneNumber={phoneForOtp} // Pass phone number to OTP component
                  onClose={() => setShowOtpPopup(false)} // Close the OTP popup
                />
              )}
            </TabsContent>
            <TabsContent value="login">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="grid gap-2 mt-6">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
