"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import { FinanceProvider } from "./context/FinanceContext";
import { Roboto } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--dm-serif",
});

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine active tab based on the pathname
  const getTabIndex = () => {
    if (pathname.startsWith("/transactions")) return 1;
    if (pathname.startsWith("/budget")) return 2;
    if (pathname.startsWith("/trends")) return 3;
    return 0; // Default to Dashboard
  };

  return (
    <html lang="en" className={dmSerif.variable}>
      {/* ✅ Apply variable at HTML level */}
      <body className={roboto.className}>
        <Container>
          <Typography
            fontSize={40}
            fontWeight={"bold"}
            variant="h1"
            gutterBottom
          >
            Personal Finance Dashboard
          </Typography>

          {/* ✅ Tabs for Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2, mb: 2 }}>
            <Tabs value={getTabIndex()} centered>
              <Tab component={Link} href="/dashboard" label="Dashboard" />
              <Tab component={Link} href="/transactions" label="Transactions" />
              <Tab component={Link} href="/budget" label="Budget" />
              <Tab component={Link} href="/trends" label="Trends" />
            </Tabs>
          </Box>

          {/* ✅ Renders the active page */}
          <FinanceProvider>{children}</FinanceProvider>
        </Container>
      </body>
    </html>
  );
}
