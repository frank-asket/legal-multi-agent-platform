import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-[#0c0f14]"
      >
        Back to Legal Intel
      </Link>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#0c0f14] hover:bg-slate-800",
            footerActionLink: "text-[#0c0f14] hover:text-slate-800",
          },
        }}
      />
    </div>
  );
}
