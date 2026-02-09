import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    template: "%s | Costa Rica Unlocked",
    default: "Costa Rica Unlocked",
  },
  description:
    "Costa Rica Unlocked",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <NextTopLoader color="#5750F1" showSpinner={false} />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
