// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "sonner";
import NextProgress from "@/components/next-progress";
import { QueryProvider } from "@/lib/providers/query-provider";
import { SessionProvider } from "@/lib/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Costria Admin Panel",
  description: "Admin dashboard for Costria rental platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* <ErrorBoundary> */}
        <NextProgress />

        {/* Mount Toaster ONLY ONCE */}
        <Toaster position="bottom-center" visibleToasts={1} />

        <SessionProvider>
          <QueryProvider>
            <main className="flex-1">{children}</main>
          </QueryProvider>
        </SessionProvider>
        {/* </ErrorBoundary> */}
      </body>
    </html>
  );
}
