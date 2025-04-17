import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ContextProvider from "@/context";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MoniSwap Token Airdrop",
  description: "Check if you're eligible for the $MONI token!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");
  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
        <Footer />
      </body>
    </html>
  );
}
