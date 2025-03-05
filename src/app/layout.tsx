"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FinanceProvider } from "./context/FinanceContext";
import { Roboto } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--dm-serif",
});

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Determine active tab based on the pathname
  const getTabIndex = () => {
    if (pathname.startsWith("/transactions")) return 1;
    if (pathname.startsWith("/budget")) return 2;
    if (pathname.startsWith("/trends")) return 3;
    return 0; // Default to Dashboard
  };

  const tabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Transactions", href: "/transactions" },
    { label: "Budget", href: "/budget" },
    { label: "Trends", href: "/trends" },
  ];

  return (
    <html lang="en">
      {/* ✅ Apply variable at HTML level */}
      <body className={roboto.className}>
        <QueryClientProvider client={queryClient}>
          <Container>
            <Typography
              fontSize={40}
              fontWeight={"bold"}
              variant="h1"
              sx={{
                fontSize: { xs: "32px", md: "40px", lg: "40px" }, // Mobile-friendly scaling
                fontWeight: "bold",
                textAlign: "center",
                color: "rgb(23, 23, 23)", // Ensures color is inherited properly
              }}
              gutterBottom
              className={dmSerif.className}
            >
              Personal Finance Dashboard
            </Typography>

            {/* Tabs for Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2, mb: 2 }}>
              <Tabs
                value={getTabIndex()}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
                centered={!isMobile}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.href}
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      minWidth: "auto",
                    }}
                    component={Link}
                    href={tab.href}
                    label={tab.label}
                  />
                ))}
              </Tabs>
            </Box>

            {/* ✅ Renders the active page */}
            <FinanceProvider>{children}</FinanceProvider>
          </Container>
        </QueryClientProvider>
      </body>
    </html>
  );
}
