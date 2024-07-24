import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import "../login.css"
export default function Page() {
  
  return (
    <div className=" flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
}