"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Oculta Header nas rotas login e paciente
  const hideHeaderRoutes = ["/login", "/paciente"];

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!hideHeaderRoutes.includes(pathname) && <Header />}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="text-sm"
          theme="colored"
        />

        <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
