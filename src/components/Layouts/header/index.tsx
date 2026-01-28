"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      <div className="hidden sm:block">
        <div className="flex flex-col gap-1">
          <nav>
            <ol className="flex items-center gap-2 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-primary">Dashboard</Link>
              </li>
              {(() => {
                const segments = pathname.split("/").filter(Boolean);
                let currentAccumulatedPath = "";

                return segments.map((segment, index) => {
                  currentAccumulatedPath += `/${segment}`;
                  if (segment === "admin") return null;

                  let label = segment;
                  if (segment === "destinos") label = "Destinos";
                  if (segment === "tours") label = "Tours";
                  if (segment === "paquetes") label = "Paquetes";
                  if (segment === "create") label = "Nuevo";
                  if (segment === "edit") label = "Editar";
                  if (segment.length > 15 && !["destinos", "tours", "paquetes"].includes(segment)) label = "Detalles";

                  const isLast = index === segments.length - 1;

                  return (
                    <li key={currentAccumulatedPath} className="flex items-center gap-2">
                      <span>/</span>
                      {isLast ? (
                        <span className="text-primary capitalize">{label}</span>
                      ) : (
                        <Link href={currentAccumulatedPath} className="hover:text-primary capitalize">
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                });
              })()}
            </ol>
          </nav>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="relative w-full max-w-[300px]">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
          />

          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
        </div>

        <ThemeToggleSwitch />

        <Notification />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
