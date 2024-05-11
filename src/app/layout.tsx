"use client";
import { Poppins } from "next/font/google";
import NavbarComponent from "./components/navbar/navbar";
import { usePathname } from "next/navigation";
import { AuthContextProvider } from "./context/AuthContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  display: 'swap'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="es">
      <head>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🔎</text></svg>"></link>
      <title>Encuentra a tu mascota</title>
      </head>
      <body className={`${poppins.className} relative`}>
        <AuthContextProvider>
          {<NavbarComponent />}
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
