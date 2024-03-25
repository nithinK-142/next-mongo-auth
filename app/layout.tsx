import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const kanit = Kanit({
  weight: ["100", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJs Mongo Auth",
  description: "Guide to create authentication app using nextjs and mongodb.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
