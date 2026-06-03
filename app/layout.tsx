import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sipsawiya LMS - Premium Tuition Platform",
  description: "Empowering teachers and students through excellence in learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
