"use client";
import { Poppins } from "next/font/google";
import NavbarComponent from "./components/navbar/navbar";
import { usePathname } from "next/navigation";
import { AuthContextProvider } from "./context/AuthContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="es">
      <body className={`${poppins.className} relative`}>
        <AuthContextProvider>
          {<NavbarComponent />}
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
