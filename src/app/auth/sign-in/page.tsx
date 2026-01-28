import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in | Admin Dashboard",
};

export default function SignIn() {
  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#030014]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_farthest-side_at_10%_20%,_rgba(58,134,255,0.15),_transparent),radial-gradient(circle_farthest-side_at_90%_80%,_rgba(131,56,236,0.15),_transparent),radial-gradient(circle_farthest-side_at_50%_50%,_rgba(255,0,110,0.1),_transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-[500px]">
          {/* Glow effects behind card */}
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-purple-500/20 blur-[100px]" />

          <div className="relative overflow-hidden rounded-2xl bg-white/5 p-4 shadow-2xl backdrop-blur-xl border border-white/10 sm:p-12.5">
            <div className="mb-10 flex flex-col items-center justify-center text-center">
              <Link className="mb-8 inline-block" href="/">
                <Image
                  className="hidden dark:block drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={180}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={180}
                  height={32}
                />
              </Link>

              <h1 className="mb-2 text-2xl font-bold text-white sm:text-heading-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Bienvenido al Futuro
              </h1>
              <p className="font-medium text-gray-400">
                Accede al panel de control avanzado
              </p>
            </div>

            <Signin />

            <div className="mt-8 text-center text-xs text-gray-500">
              Secured by Quantum Link Enc. &copy; 2026
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
