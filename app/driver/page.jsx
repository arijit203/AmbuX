'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    license_plate: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/driver/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        // Redirect to driver dashboard on successful registration
        toast.success("Registration Successful!")
        router.push('/driver/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
        toast.error("Error Registering!")
      console.error('Error registering:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/driver/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token (or any other authentication data) if needed
        localStorage.setItem('token', data.token);
        // Redirect to driver dashboard on successful login
        toast.success("Login Successful!")
        router.push('/driver/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
        toast.error("Error Registering!")
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[100dvh] w-full">
      <div className="flex flex-col items-center justify-center bg-primary p-6 md:p-10">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-primary-foreground">Welcome Ambulance Driver</h1>
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
                  <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                  <Input id="name" placeholder="Enter your name" value={form.name} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleInputChange}  required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" value={form.phone} onChange={handleInputChange}  required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                  <Input id="password" type="password" placeholder="Enter a password" value={form.password} onChange={handleInputChange}  required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license_plate">Driver License Plate <span className="text-red-500">*</span></Label>
                  <Input id="license_plate" placeholder="Enter your driver license plate" value={form.license_plate} onChange={handleInputChange}  required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea id="address" placeholder="Enter your home address" value={form.address} onChange={handleInputChange}  required />
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="grid gap-2 mt-6">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                  <Input id="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleInputChange} />
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
  )
}
