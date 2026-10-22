import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import { AdminProvider } from "../lib/context/AdminContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/layout/WhatsAppButton";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata = {
  title: "Deepak Textiles | Clothing & Fabric Wholesaler | Darbhanga, Bihar",
  description:
    "Deepak Textiles (Estd. 2001) - Premier Clothing & Fabric Wholesaler in Darbhanga, Bihar. Bulk Designer Sarees, Suit Pieces, Shirting & Suiting, and Lehenga collections for retailers, resellers, and bulk buyers across India.",
  keywords: "deepak textiles darbhanga, bihar saree wholesale, fabric wholesaler darbhanga, wholesale suit pieces darbhanga, deepak textiles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${nunitoSans.className} min-h-screen flex flex-col bg-sitebg text-txt-primary`}>
        <AdminProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AdminProvider>
      </body>
    </html>
  );
}
