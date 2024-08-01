import { Inter, Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/Header";
import ToasterContext from "./context/ToasterContext";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });
import { DriverLocationProvider } from "./context/DriverLocationContext";

import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <DriverLocationProvider>
        <html lang="en">
          <body>
            <Toaster />
            {children}
          </body>
        </html>
      </DriverLocationProvider>
    </ClerkProvider>
  );
}
