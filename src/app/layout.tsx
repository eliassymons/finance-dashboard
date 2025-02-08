import type { Metadata } from "next";

import "./globals.css";
import { FinanceProvider } from "./context/FinanceContext";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Finance Dashboard",
  description: "Manage your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <FinanceProvider>{children}</FinanceProvider>
      </body>
    </html>
  );
}
