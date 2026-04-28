import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GuitarTuner - 免费在线吉他调音器",
  description: "使用原生 Web Audio API 的免费在线吉他调音器，支持多种乐器，精准调音，界面现代轻量，移动端适配。",
  keywords: "吉他调音器, 在线调音器, 乐器调音, 免费调音器, Web Audio API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-light text-dark">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}