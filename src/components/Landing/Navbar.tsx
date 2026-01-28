import Link from "next/link";
import { Logo } from "@/components/logo";

export function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-stroke bg-white/80 px-4 py-4 backdrop-blur-md dark:border-strokedark dark:bg-black/80 md:px-6 2xl:px-10">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
                <Link href="/">
                    <Logo />
                </Link>
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-dark hover:text-primary dark:text-white"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}
