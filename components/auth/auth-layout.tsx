import Link from "next/link";
import { AuthShowcase } from "@/components/auth/auth-showcase";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh]">
      <AuthShowcase />

      <div className="relative flex flex-1 flex-col bg-white text-zinc-900 lg:border-l lg:border-zinc-100">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-10">
          <Link
            href="/"
            className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 lg:hidden"
          >
            DevTalk
          </Link>

          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
