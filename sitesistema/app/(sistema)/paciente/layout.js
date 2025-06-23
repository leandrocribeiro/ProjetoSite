"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="text-sm"
        theme="colored"
      />
      {children}
    </div>
  );
}
