import { SignUp } from "@clerk/nextjs";
import "../login.css"
export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}