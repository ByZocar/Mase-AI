import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mase — Ventas con tacto humano para LATAM",
  description:
    "El motor de ventas y crecimiento con IA que se siente humano. Outbound multicanal — WhatsApp, voice notes, LinkedIn, email — con tono LATAM nativo.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #bcb8b1",
              color: "#463f3a",
            },
          }}
        />
      </body>
    </html>
  );
}
