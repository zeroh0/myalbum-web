import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/app/lib/auth-context";
import { LoadingProvider } from "@/app/lib/loading-context";
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
  title: {
    default: "MyAlbum",
    template: "%s | MyAlbum",
  },
  description: "사진과 앨범을 공유하는 온라인 갤러리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <AuthProvider>{children}</AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
