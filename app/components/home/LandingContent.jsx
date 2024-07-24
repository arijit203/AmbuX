import { SignIn } from "@clerk/nextjs"; // Clerk's sign-in component

export default function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}