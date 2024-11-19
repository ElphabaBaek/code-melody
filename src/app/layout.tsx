import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "suno api",
  description: "Use API to call the music generation ai of suno.ai",
  keywords: ["suno", "suno api", "suno.ai", "api", "music", "generation", "ai"],
  creator: "@gcui.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col overflow-y-scroll min-h-screen`} >
        <Header />
        <main className="flex-1 flex-col items-center m-auto w-full h-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
